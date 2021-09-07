<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxSize" class="file-upload-field" @click="showDialogWindow" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
            <input ref="fileInput" type="file" multiple hidden @change="addFilesDialogWindow">
        </div>

        <div class="file-container">
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
    import {defineComponent, PropType} from 'vue';
    import FileComponent               from './File.vue';

    export interface LoadingFile{
        file: File,
        index: number,
        image?: string | ArrayBuffer,
        progress: number,
    }

    // ! think about load one file on load many files
    export default defineComponent({

        components: {
            FileComponent,
        },

        props: {
            maxSize: {
                type   : Number,
                default: 10,
            },
            message: {
                type   : String,
                default: 'Drop files here!',
            },
            checkingHandler: {
                type   : Function,
                default: undefined, 
            },
            repeatFiles: {
                type   : Boolean,
                default: true, 
            },
            autoLoad: {
                type   : Boolean,
                default: true,
            },
        },
        
        data: function(){
            return {
                files        : [] as Array<LoadingFile>,
                dragStatus   : false as boolean,
                images       : [] as Array<string>,
                filesProgress: [] as Array<number>,
                currentIndex : 0 as number,
            }
        },

        methods: {

            showDialogWindow: function(): void{
                const input: HTMLInputElement = this.$refs.fileInput as HTMLInputElement;
                input.click();
            },
            // ! e should have a type of EventType
            // ! e.target has to be casted to HTMLInputElement
            // ! There has to be a NULL check
            // ! e.target.files returns FileList, not an array of File
            // ! Using 'any' type generally doesn't make sense
            addFilesDialogWindow: function(e: InputEvent): void{
                // const newFiles: Array<File> = e.target.files;
                // this.addFiles(newFiles);
                const newFiles: FileList | null = (e.target as HTMLInputElement).files;

                if (newFiles) {
                    this.addFiles(newFiles);
                }
            },
            
            // ! If it can be null, it will be null, eventually
            dragDrop: function(e: DragEvent): void {
                const newFiles: FileList = e.dataTransfer!.files;
                this.addFiles(newFiles);
            },

            dragOver: function(e: DragEvent): void{
                this.dragStatus = true;
            },

            dragLeave: function(e: DragEvent): void{
                this.dragStatus = false;
            },
            
            //? Can I decomposite this code?
            addFiles: function(newFiles: FileList): void{

                let allowedFiles: Array<File> = [];

                if(this.checkingHandler !== undefined){
                    // ! FileList type doesn't have forEach, it's not an array
                    // ! this code wouldn't work
                    // newFiles.forEach((file: File) => {
                    //     this.checkingHandler!(file); // !think about it
                    // });
                    for (const file of newFiles) {
                        this.checkingHandler(file);
                    }
                }

                this.dragStatus = false;

                // newFiles.forEach((newFile: File) => {
                //     if(this.files.length >= this.maxSize) return;
                //     if(this.repeatFiles) {allowedFiles.push(newFile)}
                //     if(!this.repeatFiles && !(this.files.find(loadFile => loadFile.file.name == newFile.name))) allowedFiles.push(newFile);
                // });

                for (const newFile of newFiles) {
                    if(this.files.length >= this.maxSize) return;
                    if(this.repeatFiles) {allowedFiles.push(newFile)}
                    if(!this.repeatFiles && !(this.files.find(loadFile => loadFile.file.name == newFile.name))) allowedFiles.push(newFile);
                }

                allowedFiles.forEach((file: File) => {
                    const reader: FileReader = new FileReader();
                    reader.addEventListener('load', (e) => {
                        if(!e.target) return;
                        const src: string | ArrayBuffer  | null = e.target.result;
                        this.files.push({file: file, image: src || '', index: this.currentIndex++, progress: 0});
                    });
                    reader.readAsDataURL(file);
                });

                if(this.autoLoad) {
                    this.files.forEach((loadingFile: LoadingFile) => {
                        console.log('autoLoad: ', loadingFile.progress)
                        if(loadingFile.progress == 100) return;
                        console.log('autoLoad: ', loadingFile.progress)
                        this.$emit('loadHandler', loadingFile);
                    });
                }

                console.log('end:', this.files);
            },

            loadFiles: function(){
                console.log(this.files);
            },

            removeFile: function(removingFile: LoadingFile): void{
                this.files = this.files.filter((file: LoadingFile) => file.index != removingFile.index);
            }
        }
    });
</script>


<style lang="scss" scoped>
    .file-upload-container{
        margin-top: 20px;

        .file-upload-field{
            padding: 20px;
            border: 2px dashed #0cdfa0;
            display: grid;
            justify-content: center;

            span{
                font-size: 20px;
            }
        }

        .file-upload-field-drag{
            border: 2px dashed #4678e4;
        }
    }
</style>