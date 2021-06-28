<template>
    <div class="crud-index">
        <h1>Index page of CRUD</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
        </div>

        <div class="buttons-wrap">
            <router-link :to="'/crud/create'">Create item</router-link>
        </div>

        <div class="section">

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

            <div class="pagination">
                <Pagination
                    ref="pagination"
                    :take=take
                    :currentPage=currentPage
                    :pageSize="7"
                    :endButton="true"
                    :startButton="true"
                    v-on:page-change="pageChangeEvt"
                />   
            </div> 
        </div>
    </div>    
</template>

<script lang="ts">

    import {defineComponent} from 'vue';
    import Pagination        from '../../components/crudComponent/Pagination.vue';


    export default defineComponent({

        components: {
            Pagination,
        },

        data: function(){
            return {
                articles   : [] as Array<Record<string, unknown>>,
                take       : 10 as number,
                currentPage: 1 as number,
            }
        },

        mounted: function(){
            this.getArticles({take: this.take, skip: 0});
            this.getArticlesAmount();
        },

        
        methods: {
            
            getArticles: function(data: {take: number; skip: number}){

                this.$axios.post('/crud', {skip: data.skip, take: data.take})
                .then((responce) => {
                    if(responce.status != 200){
                        alert('SOO sad. Status in not 200ok');
                    }
                    this.articles = responce.data.articles;
                });
            },

            getArticlesAmount: function(){
                this.$axios.post('/crud/amount')
                .then((responce) => {
                    if(responce.status != 200){
                        alert('SOO sad. Status in not 200ok');
                    }
                    
                    const pagination          = this.$refs.pagination! as any;
                    pagination.setAmountElements(responce.data.amount);
                });
            },

            pageChangeEvt: function(data: {take: number; skip: number}){
                this.getArticles(data);
            },

        },
    });

</script>