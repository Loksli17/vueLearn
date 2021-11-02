<template>

    <div class="crud-seq-index">

        <h1>Index page of Video</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <button class="create-btn">Create item</button>
        </div>

        <div class="section">
            <div v-if="videos.length" class="videos-wrap">

                <div class="video"  v-for="video in videos" :key="video.id">
                    <div>{{video.id}}</div>
                    <div>{{video.name}}</div>
                    <button>Play</button>
                </div>

            </div>
            <b v-else> -- NO VIDEOS -- 😔</b>
        </div>

    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';
    import VideoService        from '../../services/VideoService';

    export default defineComponent({

        data(){
            return {
                videos: [] as Array<Record<string, any>>,
            }
        },

        async mounted(){
            await this.getVideos();
        },

        methods: {

            async getVideos(){
                this.videos = await VideoService.getVideos();
            }
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
        }

        a, button{
            @extend %button;
            max-width: 200px !important;
        }

        .create-btn{
            @extend %create-button;
        }
    }
</style>