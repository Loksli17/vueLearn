<template>

    <div class="file">
        <div class="file-img" @click="showPopup = true" v-if="loadingFile.image" :style="{backgroundImage: `url('${loadingFile.image}'`}"></div>
        <img v-else :src="require(`@/assets/img/type-icons/${loadingFile.icon}`) " alt="">


        <div class="content">
            <div class="filename">
                <span>{{loadingFile.shortName}}</span>
                <span>({{loadingFile.normalType}})</span> 
            </div>
            
            <div v-if="loadingFile.static" class="static-file">
                <span>This file was already upload</span>  
            </div>

            <div v-else-if="progressBarType == 'different'">
                <button @click.prevent="continueUpload" v-if="loadingFile.addStatus == 'before'">Continue upload</button>
                <progress :value="progress" max="100">{{progress}}%</progress>
            </div>
        </div>

        
        <div class="remove-file" @click="removeFile">&#10006;</div>

        <ModalWrapper v-model:show-modal="showPopup" v-if="showPopup">
            <h1>File {{loadingFile.file.name}}</h1>
            <div class="file-large-img" v-if="loadingFile.image" :style="{backgroundImage: `url('${loadingFile.image}'`}"></div>
        </ModalWrapper>
    </div>
    
</template>


<script lang="ts">
    import { defineComponent } from 'vue';
    import { LoadingFile }     from './types';
    import { ProgressBar }     from './utils';
    import ModalWrapper        from '../Modal/ModalWrapper.vue';

    export default defineComponent({

        components: {
            ModalWrapper,
        },
        
        props: {
            loadingFile: {
                type    : Object as () => LoadingFile,
                required: true,
            },
            progress: {
                type   : Number,
                default: 0, 
            },
            progressBarType: {
                type   : String,
                default: ProgressBar.Different,
            }
        },

        watch: {
            progress: function(newVal, oldVal){
                console.log(`file[${this.loadingFile.index}]:`, oldVal, newVal);
            },
        },

        data: function(){
            return {
                iconWay  : '',
                showPopup: false as boolean,
            }
        },

        methods: {
            removeFile: function(){
                this.$emit('remove-file', this.loadingFile);
            },

            continueUpload: function(){
                console.log('1');
                this.$emit('continue-upload', this.loadingFile);
            },
        }
    });

</script>


<style lang="scss">
    .file{
        width: 100%;
        display: grid;
        column-gap: 20px;
        grid-template-columns: 60px 1fr max-content;
        align-items: center;
        height: 50px;

        .content{
            display: grid;
            grid-template-columns: max-content auto;
            
            .filename{
                word-wrap: break-word;
            }
        }

        img{
            width: 100%;
        }

        .filename{
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            justify-content: center;
            font-size: 18px;
        }

        .file-img{
            height: 100%;
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

    .modal-wrapper .modal-wrapper-body{
        display: grid;
        grid-template-rows: max-content auto;
        height: 80%;
        
        .file-large-img{
            height: 100%;
            background-position: center;
            background-size: cover;
        }
    }


    @media screen and (max-width: 700px) {
        .file{
            height: 40px;
            column-gap: 8px;
            grid-template-columns: 40px 1fr max-content;

            .filename{
                font-size: 16px;
            }
        }
    }
</style>