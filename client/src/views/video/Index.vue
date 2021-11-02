<template>

    <div class="crud-seq-index">

        <h1>Index page of Video</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <button class="create-btn" @click="showPopup = true">Create item</button>
        </div>

        <div class="section">
            <div v-if="videos.length" class="videos-wrap">

                <div class="video"  v-for="video in videos" :key="video.id">
                    <div class="id">{{video.id}}</div>
                    <div class="name">{{video.name}}</div>
                    <div class="description">{{video.shortDescription}}</div>
                    <button class="show-video-player">Play</button>
                </div>

            </div>
            <b v-else> -- NO VIDEOS -- 😔</b>
        </div>

        <ModalWrapper 
            v-model:show-modal="showPopup" 
            :transition-name="'modal-zoom'">
            
            <h1>Video upload</h1>

            <FileUpload
                :maxFilesAmount="4"
                :autoLoad="true"
                :maxFileSize="1024 * 1024 * 1000"
                :types="['mp4', 'mkv']"
                :progressBar="'different'"
                v-model:progress="progress"
                :files="files"
                
                v-on:load-handler="videosLoad"
                v-on:type-error-handler="fileTypeError"
                v-on:size-error-handler="fileSizeError"
                v-on:not-drag-and-drop-capable-error="dragAndDropCapableError"
            />

        </ModalWrapper>

    </div>
</template>


<script lang="ts">
    import { defineComponent }      from 'vue';
    import VideoService             from '../../services/VideoService';
    import ModalWrapper             from "@/components/Modal/ModalWrapper.vue";
    import FileUpload               from '../../components/FileUpload/FileUpload.vue';
    import { LoadingFile, AddFile } from '../../components/FileUpload/types';


    export default defineComponent({

        components: {
            ModalWrapper,
            FileUpload
        },

        data(){
            return {
                videos   : [] as Array<Record<string, any>>,
                showPopup: false as boolean,

                types   : [] as Array<Record<string, any>>,
                files   : [] as Array<AddFile>,
            }
        },

        async mounted(){
            await this.getVideos();
        },

        methods: {

            async getVideos(){
                this.videos = await VideoService.getVideos();
            },

            videosLoad: async function(files: Array<LoadingFile>){
                 
                files.forEach(async (loadingFile: LoadingFile) => {
                    const data: FormData = new FormData();
                    data.append('image', loadingFile.file);
                    await VideoService.videoUpload(data, loadingFile);
                });

            },
        }

    });
</script>


<style lang="scss">
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line{
        @extend %add-line;

        button{
            border: 0;
            cursor: pointer;
        }

        a, button{
            @extend %button;
            max-width: 200px !important;
        }

        .create-btn{
            @extend %create-button;
        }
    }

    .modal-wrapper .modal-wrapper-body {
        height: max-content;
    }

    .videos-wrap{
        display: grid;
        row-gap: 20px;

        .video{
            display: grid;
            grid-auto-flow: column;
            box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
            padding: 15px 20px;
            background: rgb(247, 245, 245);

            grid-template-columns: max-content 150px 1fr 100px;
            column-gap: 30px;
            align-items: center;

            button {
                @extend %button;
                border: 0;
                cursor: pointer;
            }

            .id{
                font-size: 29px;
                padding-right: 20px;
            }

            .name{
                font-size: 24px;
                color: blue;
            }
        }
    }
</style>