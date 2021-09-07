<template>

    <div class="file">
        <img width="50" v-if="loadingFile.image" :src="loadingFile.image" alt="">
        <span>{{loadingFile.file.name}}</span>
        <progress :value="progress" max="100"></progress>
        <div class="remove-file" @click="removeFile">&#10006;</div>
    </div>
    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import {LoadingFile}     from './FileUpload.vue';

    export default defineComponent({
        
        props: {
            loadingFile: {
                type    : Object as () => LoadingFile,
                required: true,
            },
            // image: {
            //     type    : String,
            //     required: true,
            // },
            // index: {
            //     type    : Number,
            //     required: true,
            // },
            progress: {
                type   : Number,
                default: 0, 
            }
        },

        watch: {
            progress: function(newVal, oldVal){
                console.log(`file[${this.loadingFile.index}]:`, oldVal, newVal);
            },
        },

        methods: {
            removeFile: function(){
                this.$emit('remove-file', this.loadingFile);
            }
        }
    });

</script>


<style lang="scss" scoped>
    .file{
        display: grid;
        column-gap: 20px;
        grid-template-columns: 60px 1fr 2fr max-content;
        align-items: center;

        .remove-file{
            font-size: 25px;
            cursor: pointer;
        }

        progress{
            width: 100%;
        }
    }
</style>