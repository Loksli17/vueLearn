<template>
    
    <div class="file-upload-container">
       
        <div v-if="localFiles.length < maxFilesAmount" class="file-upload-field" @click="showDialogWindow" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
            <input ref="fileInput" :name="name" type="file" :multiple="maxFilesAmount > 1 ? true : false" hidden @change="addFilesDialogWindow">
        </div>

        <div v-if="localFiles.length" class="file-container">
            <FileComponent
                v-for="file in localFiles" :key="file.index"
                :loadingFile="file"
                :progressBarType="progressBar"
                v-model:progress="file.progress"
                v-on:remove-file="removeFile"
                v-on:continue-upload="continueUpload"
            />
            <button v-if="!autoLoad" @click="loadFiles">Send files</button>
        </div>

        <progress v-if="progressBar == 'overall' && localFiles.length" :value="progress" max="100">{{progress}}%</progress>
    </div>

</template>


<script lang="ts">
    import {defineComponent }                  from 'vue';
    import FileComponent                       from './File.vue';
    import { AddFile, LoadingFile, AddStatus } from './types';

    import { typeIcons, ProgressBar, normalFileSize, readFile, getTypeFromFile } from './utils';

    /**
     * todo some methods in utils file?
     */

    export default defineComponent({

        components: {
            FileComponent,
        },

        emits: [
            'not-drag-and-drop-capable-error',
            'load-handler',
            'type-error-handler',
            'size-error-handler',
            'continue-upload'
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
            },
            progressBar: {
                type   : String,
                default: 'different', 
            },
            progress: {
                type   : Number,
                default: 0,
            },
            files: {
                type   : Array as () => Array<AddFile>,
                default: () => [],
            }
        },
        
        data: function(){
            return {
                localFiles   : [] as Array<LoadingFile>,
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
                return normalFileSize(this.maxFileSize);
            },   
        },

        created: function(){
            this.computedLocalFiles();

            if(!this.determineDragAndDropCapable()) {
                const msg: string = `Browser doesn't has supporting of DRAG and DROP API`;
                this.$emit('not-drag-and-drop-capable-error', msg);
                throw new Error(msg);
            }

            if(!Object.values(ProgressBar).includes(this.progressBar as ProgressBar)){
                throw new Error(`Unexpected value "${this.progressBar}" for progressBar property`);
            }
        },

        methods: {

            showDialogWindow: function(): void {
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
                    if(this.localFiles.length >= this.maxFilesAmount) return;
                    if(this.repeatFiles) {allowedFiles.push(newFile)}
                    if(!this.repeatFiles && !(this.localFiles.find(loadFile => loadFile.file.name == newFile.name))) allowedFiles.push(newFile);
                }

                //todo think about message to user
                if(allowedFiles.length > this.maxFilesAmount + this.localFiles.length) allowedFiles.length = this.maxFilesAmount + this.localFiles.length;

                for(let i = 0; i < allowedFiles.length; i++){
                    const 
                        file: File = allowedFiles[i],
                        loadingFile: LoadingFile = await this.fromFileToLoadingFile({file}, AddStatus.After);

                    this.localFiles.push(loadingFile);
                    sendedFiles.push(this.localFiles[this.localFiles.length - 1]); // ! it needs for parralel uploading of files / working with pointer.
                }

                if(this.autoLoad) this.$emit('load-handler', sendedFiles);
            },


            loadFiles: function(){
                
                const sendedFiles: Array<LoadingFile> = [];
                for(let i: number = 0; i < this.localFiles.length; i++){
                    if(!this.localFiles[i].progress) {
                        sendedFiles.push(this.localFiles[i]);
                    }
                }

                this.$emit('load-handler', sendedFiles);
            },


            removeFile: function(removingFile: LoadingFile): void{
                this.localFiles = this.localFiles.filter((file: LoadingFile) => file.index != removingFile.index);
            },

            continueUpload: function(loadingFile: LoadingFile): void{
                console.log('2');
                this.$emit('continue-upload', loadingFile);
            },

            checkFileType: function(file: File){

                let 
                    type: string = getTypeFromFile(file),
                    flag: boolean = false;

                this.types.forEach((allowType: string) => {
                    if(type.includes(allowType)) flag = true
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
            },


            fromFileToLoadingFile: async function(addFile: AddFile, addStatus: AddStatus){

                const
                    imagesTypes     : Array<string>        = ['.svg', '.jpeg', '.jpg', '.png'],
                    dataFile        : string | ArrayBuffer = await readFile(addFile.file),
                    clearFileName   : string               = addFile.file.name.slice(0, addFile.file.name.indexOf('.'));

                const typeFile: string = getTypeFromFile(addFile.file);

                const loadingFile: LoadingFile = {
                    file      : addFile.file, 
                    index     : this.currentIndex++, 
                    progress  : addFile.progress || 0,
                    image     : imagesTypes.includes(typeFile.toLowerCase()) && typeof dataFile == "string" ? dataFile : '',
                    icon      : !imagesTypes.includes(typeFile) && typeof dataFile == "string" ? (this.typeIcons[typeFile] || 'default.png') : 'default.png',
                    shortName : (clearFileName.length > 5) ? `${clearFileName.slice(0, 5)}..`: clearFileName,
                    normalType: typeFile,
                    static    : addFile.static,
                    addStatus : addStatus, 
                };

                return loadingFile;
            },


            computedLocalFiles: function() {
                this.files.forEach(async (file: AddFile) => {
                    const loadingFile: LoadingFile = await this.fromFileToLoadingFile(file, AddStatus.Before);
                    this.localFiles.push(loadingFile);
                });
            },
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

        @mixin progress{
            display: block;
            width: 100%;
            border-radius: 10px;
        }

        progress{
            margin-top: 20px;
            @include progress;
            appearance: none;
        }

        progress::-webkit-progress-value{
            @include progress;
            background-color: rgb(76, 231, 231);
        }

        progress::-webkit-progress-bar{
            @include progress;
            background-color: rgb(203, 216, 216);
        }

        progress::-moz-progress-bar{
            @include progress;
            background-color: rgb(203, 216, 216);
        }
    }
</style>