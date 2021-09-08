<template>

    <div class="file">
        <div class="file-img" v-if="loadingFile.image" :style="{backgroundImage: `url('${loadingFile.image}'`}"></div>

        <div class="filename">
            <span>{{loadingFile.shortName}}</span>
            <span>({{loadingFile.normalType}})</span>
        </div>
        
        <progress :value="progress" max="100">{{progress}}%</progress>
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
        width: 100%;
        display: grid;
        column-gap: 20px;
        grid-template-columns: 60px 1fr 3fr max-content;
        align-items: center;
        height: 50px;

        .file-img{
            height: 100%;
            background: rgb(76, 231, 231);
            background-position: center;
            background-size: cover;
        }

        .remove-file{
            font-size: 25px;
            cursor: pointer;
        }

        @mixin progress{
            display: block;
            width: 100%;
            border-radius: 10px;
        }

        progress{
            @include progress;
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

        // progress:not([value]), progress:not([value])::-webkit-progress-bar, progress:not([value])::-webkit-progress-value {
        //     @include progress(rgb(203, 216, 216));
        // }

        // progress:not([value])::-moz-progress-bar {
        //     @include progress(rgb(203, 216, 216));
        // }
    }

     @media screen and (max-width: 700px) {
        .file{
            height: 40px;
            column-gap: 8px;
            grid-template-columns: 40px 1fr 2fr max-content;
        }
    }
</style>