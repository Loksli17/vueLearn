<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxSize" class="file-upload-field" @click="showDialogWindow" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
            <input ref="fileInput" type="file" multiple hidden @change="addFilesDialogWindow">
        </div>

        <div class="file-container">
            <FileComponent
                v-for="(file, index) in files" :key="index"
                :file="file"
                :src="images[index]"
                :index="index"
                v-on:remove-file="removeFile"
            />

            <button v-if="!this.autoLoad" @click="sendFiles">Send files</button>
        </div>
    </div>

</template>


<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import FileComponent               from './File.vue';


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
                files     : [] as Array<File>,
                dragStatus: false as boolean,
                images    : [] as Array<string>,
            }
        },

        methods: {

            showDialogWindow: function(): void{
                const input: HTMLInputElement = this.$refs.fileInput as HTMLInputElement;
                input.click();
            },

            addFilesDialogWindow: function(e: any): void{
                const newFiles: Array<File> = e.target.files;
                this.addFiles(newFiles);
            },
            
            dragDrop: function(e: any): void{
                const newFiles: Array<File> = e.dataTransfer.files;
                this.addFiles(newFiles);
            },

            dragOver: function(e: any): void{
                this.dragStatus = true;
            },

            dragLeave: function(e: any): void{
                this.dragStatus = false;
            },
            
            //? Can I decomposite this code?
            addFiles: function(newFiles: Array<File>): void{

                let allowedFiles: Array<File> = [];

                if(this.checkingHandler !== undefined){
                    this.files.forEach((file: File) => {
                        this.checkingHandler!(file); // !think about it
                    });
                }

                this.dragStatus = false;

                newFiles.forEach((newFile: File) => {
                    if(this.files.length >= this.maxSize) return;
                    if(this.repeatFiles) {allowedFiles.push(newFile)}
                    if(!this.repeatFiles && !(this.files.find(file => file.name == newFile.name))) allowedFiles.push(newFile);
                });
                
                if(this.autoLoad) {
                    allowedFiles.forEach((file: File) => {
                        this.$emit('loadHandler', file);
                    });
                }

                const pushSourceOfFile = (e: any) => {
                    const src: string = e.target.result;
                    this.images.push(src);
                };

                allowedFiles.forEach((file: File) => {
                    const reader: FileReader = new FileReader();
                    reader.addEventListener('load', pushSourceOfFile);
                    reader.readAsDataURL(file);
                });

                this.files = this.files.concat.apply(this.files, allowedFiles);
            },

            loadFile: function(){
                
            },

            removeFile: function(removeIndex: number): void{
                this.files  = this.files.filter((file: File, index: number)     => index != removeIndex);
                this.images = this.images.filter((image: string, index: number) => index != removeIndex);
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