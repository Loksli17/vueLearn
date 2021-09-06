<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxFiles" class="file-upload-field" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
        </div>
    </div>

</template>


<script lang="ts">
    import {defineComponent, PropType} from 'vue';

    export default defineComponent({

        props: {
            
            maxFiles: {
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
                
                this.files = e.dataTransfer.files;

                if(this.checkingHandler !== undefined){
                    this.files.forEach((file: File) => {
                        this.checkingHandler!(file); // !think about it
                    });
                }

                const func = (e: any) => {
                    const data = e.target.result;
                    this.images.push(data);
                };

                this.files.forEach((file: File) => {
                    const reader: FileReader = new FileReader();
                    reader.addEventListener('load', func);
                    reader.readAsDataURL(file);
                });
                
                this.dragStatus = false;
            },

            dragOver: function(e: any){
                this.dragStatus = true;
            },

            dragLeave: function(e: any){
                this.dragStatus = false;
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