<template>
    <div class="crud-index">
        <h1>Index page of CRUD</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
        </div>

        <div class="buttons-wrap">
            <router-link :to="'/crud/create'">Create item</router-link>
        </div>

        <div class="table-wrap">

            <table>
                <tr>
                    <th>id</th>
                    <th>title</th>
                    <th>type</th>
                    <th>isReady</th>
                    <th>time</th>
                    <th>date</th>
                </tr>

                <tr v-for="item in articles" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>{{item.title}}</td>
                    <td>{{item.articleTypeId}}</td>
                    <td>{{item.isReady}}</td>
                    <td>{{item.time}}</td>
                    <td>{{item.date}}</td>
                </tr>

            </table>
        </div>
    </div>    
</template>

<script lang="ts">

    import {defineComponent} from 'vue';

    export default defineComponent({

        data: function(){
            return {
                articles: [] as Array<Record<string, unknown>>,
            }
        },

        mounted: function(){
            
            this.$axios.post('/crud', {skip: 0, take: 10})
            .then((responce) => {
                if(responce.status != 200){
                    alert('SOO sad. Status in not 200ok');
                }

                this.articles = responce.data.articles;
            });
        }
    });

</script>