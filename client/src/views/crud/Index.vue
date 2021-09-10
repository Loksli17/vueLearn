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
            <div>
                
            </div>

            <div class="table-wrap">
                <Table
                    v-if="mapArticles"
                    :columnNames="columnNames" 
                    :rowData="mapArticles" 
                    :actions="tableActions"
                    :config="{ sortableByColumn: true, hideColumn: [] }"
                    >
                    <template v-slot:footer>
                        <div> This is a footer </div>
                    </template>
                </Table> 
            </div>

            <div class="pagination">
                <Pagination
                    ref="pagination"
                    :take=take
                    :currentPage=currentPage
                    :pageGap="7"
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

    import Table from "../../components/table/Table.vue";
    import { Column, Action } from "../../components/table/types";

    export default defineComponent({

        components: {
            Pagination,
            Table
        },

        data: function(){
            return {
                articles      : [] as Array<Record<string, unknown>>,
                columnNames   : [ 
                        // ? can we create new structure such as : { fieldName: 't_type', viewName: 'Type' } ?
                        { displayedName: "Id",      fieldName: "id" },
                        { displayedName: "Title",   fieldName: "title" },
                        { displayedName: "Type",    fieldName: "t_title" },
                        { displayedName: "Ready",   fieldName: "isReady" },
                        { displayedName: "Time",    fieldName: "time" },
                        { displayedName: "Date",    fieldName: "date" },
                        { displayedName: 'Views',   fieldName: "views" },
                        { displayedName: "Actions", fieldName: "actions" },
                ] as Array<Column>,
                tableActions: [
                        { name: "View", path: (id: number) => `/crud/${id}/view` }, 
                        { name: "Edit", path: (id: number) => `/crud/${id}/edit` }, 
                        { name: "Delete", handler: this.removeArticle },
                    ] as Array<Action>,
                take          : 10 as number,
                currentPage   : 1 as number,
                amountArticles: 0 as number, 
            }
        },

        computed: {
            mapArticles: function(): Array<Record<string, unknown>>{
                return this.articles.map((item) => {
                    item.isReady = item.isReady ? 'Ready' : 'Not Ready';
                    item.time    = this.$filters.timeToView('0000-01-01 ' + item.time as string);
                    item.date    = this.$filters.dateToView(item.date as string);
                    return item;
                });
            },
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