<template>
    <div class="crud-index">
        <h1>View item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/crud'">Go index-crud</router-link>
        </div>

        <div class="buttons-wrap">
            <router-link :to="'/crud/create'">Create item</router-link>
        </div>

        <div class="table-wrap">

            <table>
                <tr>
                    <td>Id: </td>
                    <td>{{article.id}}</td>
                </tr>
                <tr>
                    <td>title: </td>
                    <td>{{article.title}}</td>
                </tr>
                <tr>
                    <td>text: </td>
                    <td>{{article.text}}</td>
                </tr>
                <tr>
                    <td>type: </td>
                    <td>{{article.t_title}}</td>
                </tr>
                <tr>
                    <td>views: </td>
                    <td>{{article.views}}</td>
                </tr>
                <tr>
                    <td>date: </td>
                    <td>{{article.date}}</td>
                </tr>
                <tr>
                    <td>time: </td>
                    <td>{{article.time}}</td>
                </tr>
                <tr>
                    <td>isReady</td>
                    <td>{{article.isReady}}</td>
                </tr>
                <!-- <tr>
                    <td>img: </td>
                    <td>{{article.img}}</td>
                </tr> -->
            </table>
        </div>
    </div>    
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import axios             from '../../libs/axios';
    import { AxiosResponse } from 'axios'

    export default defineComponent({

        data: function(){
            return {
                id: 0 as number,
                article: {} as Record<string, unknown>,
            }
        },

        mounted: async function(){
            this.id = Number(this.$route.params.id);
            
            await axios.get({
                url: `/crud/${this.id}`,
                data: {id: this.id},
                handler: (res: AxiosResponse) => {
                    this.article = res.data.article;
                    console.log(this.article);
                }
            });

        }
    })
</script>