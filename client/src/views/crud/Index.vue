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
                <table border="1">
                    <tr>
                        <th>id</th>
                        <th>title</th>
                        <th>type</th>
                        <th>isReady</th>
                        <th>time</th>
                        <th>date</th>
                        <th>actions</th>
                    </tr>

                    <tr v-for="item in articles" :key="item.id">
                        <td>{{item.id}}</td>
                        <td>{{item.title}}</td>
                        <td>{{item.t_title}}</td>
                        <td>{{item.isReady}}</td>
                        <td>{{item.time}}</td>
                        <td>{{item.date}}</td>
                        <td>
                            <a href="" @click.prevent="removeArticle(item.id)">Delete</a>
                            <router-link :to="`/crud/${item.id}/edit`">Edit</router-link>
                            <router-link :to="`/crud/${item.id}/view`">View</router-link>
                        </td>
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

    import { defineComponent } from 'vue';
    import Pagination          from '../../components/crudComponent/Pagination.vue';
    import FlashMessageData    from '../../libs/flashMessage';
    import axios               from '../../libs/axios';
    import { AxiosResponse }   from 'axios';


    export default defineComponent({

        components: {
            Pagination,
        },

        data: function(){
            return {
                articles      : [] as Array<Record<string, unknown>>,
                take          : 10 as number,
                currentPage   : 1 as number,
                amountArticles: 0 as number, 
            }
        },

        mounted: async function(){
            await this.getArticles({take: this.take, skip: 0});
            await this.getArticlesAmount();
        },

        
        methods: {
            
            getArticles: async function(data: {take: number; skip: number}){

                await axios.post({
                    url: '/crud',
                    data: {skip: data.skip, take: data.take},
                    handler: (res: AxiosResponse) => {
                        this.articles = res.data.articles;
                    }
                });

                this.articles.map(item => {
                    item.isReady = item.isReady ? 'Ready' : 'Not Ready';
                    item.time    = this.$filters.timeToView('0000-01-01 ' + item.time as string);
                    item.date    = this.$filters.dateToView(item.date as string);
                    return item;
                });
            },

            getArticlesAmount: async function(){

                await axios.post({
                    url: '/crud/amount',
                    handler: (res: AxiosResponse) => {
                        const pagination = this.$refs.pagination! as any;
                        pagination.setAmountElements(res.data.amount);
                        this.amountArticles = res.data.amount;
                    }
                });
            },

            pageChangeEvt: function(data: {take: number; skip: number}){
                this.getArticles(data);
            },

            removeArticle: async function(id: number){
                await axios.delete({
                    url: `/crud/${id}/remove`,
                    handler: (res: AxiosResponse) => {
                        const pagination = this.$refs.pagination! as any;
                        pagination.setAmountElements(this.amountArticles--);
                        this.getArticles({take: pagination.take, skip: pagination.skip});
                    }
                });

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of article', `Article with id = ${id} was removed`));
            }

        },
    });

</script>