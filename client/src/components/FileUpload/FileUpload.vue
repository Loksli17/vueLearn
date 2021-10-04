<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxFilesAmount" class="file-upload-field" @click="showDialogWindow" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
            <input ref="fileInput" :name="name" type="file" :multiple="maxFilesAmount > 1 ? true : false" hidden @change="addFilesDialogWindow">
        </div>

        <div v-if="files.length" class="file-container">
            <FileComponent
                v-for="file in files" :key="file.index"
                :loadingFile="file"
                v-model:progress="file.progress"
                v-on:remove-file="removeFile"
            />
            <button v-if="!autoLoad" @click="loadFiles">Send files</button>
        </div>
    </div>

</template>


<script lang="ts">
    import {defineComponent } from 'vue';
    import FileComponent      from './File.vue';
    import { LoadingFile }    from './types';
    import typeIcons          from './typeIcons';


    export default defineComponent({

        components: {
            FileComponent,
        },

        emits: [
            'not-drag-and-drop-capable-error',
            'load-handler',
            'type-error-handler',
            'size-error-handler',
        ],

        props: {
            maxFilesAmount: {
                type   : Number,
                default: 10,
            },
            message: {
                type   : String,
                default: 'Click on this field or drop files here!',
            },
            repeatFiles: {
                type   : Boolean,
                default: false, 
            },
            autoLoad: {
                type   : Boolean,
                default: true,
            },
            types: {
                type   : Array as () => Array<string>,
                default: null,
            },
            maxFileSize: {
                type   : Number,
                default: null,
            },
            name: {
                type   : String,
                default: 'file',
            }
        },
        
        data: function(){
            return {
                files        : [] as Array<LoadingFile>,
                dragStatus   : false as boolean,
                images       : [] as Array<string>,
                filesProgress: [] as Array<number>,
                currentIndex : 0 as number,
                typeIcons    : typeIcons,
            }
        },

        computed: {

            normalMaxFileSize: function(): string{

                if(!this.maxFileSize) throw new Error('maxFileSize is null');

                let
                    size    : number = this.maxFileSize,
                    count   : number    = 0,
                    dataType: string = '';

                while(size > 1024){
                    count++;
                    size /= 1024;
                    size = +size.toFixed(3);
                }

                switch(count){
                    case 0:
                        dataType = 'b';
                        break;
                    case 1:
                        dataType = 'kb';
                        break;
                    case 2:
                        dataType = 'mb';
                        break;
                    case 3:
                        dataType = 'gb';
                        break;
                }

                return `${size} ${dataType}`;
            }
        },

        created: function(){
            if(!this.determineDragAndDropCapable()) {
                const msg: string = `Browser doesn't has supporting of DRAG and DROP API`;
                this.$emit('not-drag-and-drop-capable-error', msg);
                throw new Error(msg);
            }
        },

        methods: {

            showDialogWindow: function(): void {
                console.log('dialogWindow');
                const input: HTMLInputElement = this.$refs.fileInput as HTMLInputElement;
                input.click();
            },

            addFilesDialogWindow: async function(e: InputEvent): Promise<void> {
                const newFiles: FileList | null = (e.target as HTMLInputElement).files;
                if (newFiles) await this.addFiles(newFiles);
            },
            
            dragDrop: async function(e: DragEvent): Promise<void> {
                if(e.dataTransfer == null) new Error('Error with dataTransfer');
                const newFiles: FileList | null = e.dataTransfer!.files;
                
                if (newFiles) {
                    const input: HTMLInputElement = this.$refs.fileInput as HTMLInputElement;
                    input.files = newFiles;
                    await this.addFiles(newFiles);
                }
            },

            dragOver: function(): void{
                this.dragStatus = true;
            },

            dragLeave: function(): void{
                this.dragStatus = false;
            },
            
            addFiles: async function(newFiles: FileList): Promise<void> {

                let 
                    allowedFiles: Array<File>        = [],
                    sendedFiles : Array<LoadingFile> = [];

                for (const file of newFiles) {
                    if(this.types != null)       this.checkFileType(file);
                    if(this.maxFileSize != null) this.checkFileSize(file);
                }

                this.dragStatus = false;

                for (const newFile of newFiles) {
                    if(this.files.length >= this.maxFilesAmount) return;
                    if(this.repeatFiles) {allowedFiles.push(newFile)}
                    if(!this.repeatFiles && !(this.files.find(loadFile => loadFile.file.name == newFile.name))) allowedFiles.push(newFile);
                }

                for(let i = 0; i < allowedFiles.length; i++){
                    const file: File = allowedFiles[i];

                    const
                        imagesTypes     : Array<string>        = ['.svg', '.jpeg', '.jpg', '.png'],
                        regExpType      : RegExp               = /\.[a-zA-Z]+$/gi,
                        dataFile        : string | ArrayBuffer = await this.readFile(file),
                        regExpTypeResult: Array<string> | null = file.name.match(regExpType),
                        clearFileName   : string               = file.name.slice(0, file.name.indexOf('.'));

                    if(!regExpTypeResult) throw Error('file has bad type');

                    const typeFile: string = regExpTypeResult[0];

                    const loadingFile: LoadingFile = {
                        file      : file, 
                        index     : this.currentIndex++, 
                        progress  : 0,
                        image     : imagesTypes.includes(typeFile.toLowerCase()) && typeof dataFile == "string" ? dataFile : '',
                        icon      : !imagesTypes.includes(typeFile) && typeof dataFile == "string" ? (this.typeIcons[typeFile] || 'default.png') : 'default.png',
                        shortName : (clearFileName.length > 5) ? `${clearFileName.slice(0, 5)}..`: clearFileName,
                        normalType: typeFile,
                    };

                    this.files.push(loadingFile);
                    sendedFiles.push(this.files[this.files.length - 1]); // ! it needs for parralel uploading of files / working with pointer.
                }

                if(this.autoLoad) this.$emit('load-handler', sendedFiles);
            },

            readFile: function(file: File): Promise<string | ArrayBuffer>{
                return new Promise((resolve, reject) => {
                    const reader: FileReader = new FileReader();

                    reader.onload = () => {
                        resolve(reader.result || '');
                    }

                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            },

            loadFiles: function(){
                
                const sendedFiles: Array<LoadingFile> = [];
                for(let i: number = 0; i < this.files.length; i++){
                    if(!this.files[i].progress) {
                        sendedFiles.push(this.files[i]);
                    }
                }

                this.$emit('load-handler', sendedFiles);
            },

            removeFile: function(removingFile: LoadingFile): void{
                this.files = this.files.filter((file: LoadingFile) => file.index != removingFile.index);
            },

            checkFileType: function(file: File){
                
                let flag: boolean = false;

                this.types.forEach((type: string) => {
                    if(file.type.includes(type)){flag = true}
                });

                if(!flag){
                    this.$emit('type-error-handler', file, `File's type not belongs types: ${this.types}`);
                    throw new Error(`Unnecessary type of file ${file.name}`);
                }
            },

            checkFileSize: function(file: File){
                if(file.size > this.maxFileSize) { 
                    this.$emit('size-error-handler', file, `File's size more then ${this.normalMaxFileSize}!`);
                    throw new Error(`File ${file.name} has so big size!`);
                }
            },

            determineDragAndDropCapable: function(){

                let div: HTMLDivElement = document.createElement('div');

                return (('draggable' in div) || ( 'ondragstart' in div && 'ondrop' in div )) &&
                    'FormData' in window && 
                    'FileReader' in window;
            }
        }
    });
</script>


<style lang="scss" scoped>
    .file-upload-container{
        margin-top: 20px;
        cursor: pointer;

        .file-container{
            margin-top: 20px;
            display: grid;
            row-gap: 10px;
        }
        
        .file-upload-field{
            padding: 20px;
            border: 2px dashed #0cdfa0;
            display: grid;
            justify-content: center;

            span{
                font-size: 20px;
            }

            &:hover{
                transition: 0.4s;
                background-color: rgba($color: #dafcf2, $alpha: 0.6);
            }
        }

        .file-upload-field-drag{
            border: 2px dashed #4678e4;
        }
    }
</style>