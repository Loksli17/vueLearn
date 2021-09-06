<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxSize" class="file-upload-field" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
        </div>

        <div class="file-container">
            <FileComponent
                v-for="(file, index) in files" :key="index"
                :file="file"
                :src="images[index]"
                :index="index"
                v-on:remove-file="removeFile"
            /> 
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
            }
        },
        
        data: function(){
            return {
                files     : [] as Array<File>,
                dragStatus: false as boolean,
                // reader    : new FileReader() as FileReader,
                images    : [] as Array<string>,
            }
        },

        methods: {
            
            dragDrop: function(e: any){
                
                const newFiles: Array<File> = e.dataTransfer.files;

                if(this.checkingHandler !== undefined){
                    this.files.forEach((file: File) => {
                        this.checkingHandler!(file); // !think about it
                    });
                }

                // ! RENAME this function. It is so stupid name. Do you think so?
                const func = (e: any) => {
                    const src: string = e.target.result;
                    this.images.push(src);
                };

                newFiles.forEach((file: File) => {
                    const reader: FileReader = new FileReader();
                    reader.addEventListener('load', func);
                    reader.readAsDataURL(file);
                });
                
                this.dragStatus = false;
                newFiles.forEach((newFile: File) => {
                    if(this.files.length >= this.maxSize) return;
                    if(this.repeatFiles) {console.log('azaza'); this.files.push(newFile)}
                    if(!this.repeatFiles && !(this.files.find(file => file.name == newFile.name))) this.files.push(newFile);
                });
            },

            dragOver: function(e: any){
                this.dragStatus = true;
            },

            dragLeave: function(e: any){
                this.dragStatus = false;
            },

            removeFile: function(removeIndex: number){
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