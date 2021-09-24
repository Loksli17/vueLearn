<template>
    <TopMenu :buttons="topMenuButtons">
        <template #left>
            ahah
        </template>
        <template #right>
            <input type="search" name="" id="">
        </template>
    </TopMenu>
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
                <button @click="showPopup = true">popup</button>
                <PopupWrapper v-model:show-popup="showPopup">
                    <div>
                        <h1>header</h1>
                        <div>
                            content
                        </div>
                        <button @click="showPopup = false">close</button>
                    </div>
                </PopupWrapper>
            </div>

            <div class="table-wrap">
                <Table
                    v-if="articles"
                    :column-names="columnNames" 
                    :row-data="articles" 
                    :actions="tableActions"
                    :config="tableConfig"
                    >
                    <template #footer>
                        <div> This is a footer </div>
                    </template>
                </Table> 
            </div>

            <div class="pagination">
                <!-- <Pagination
                    ref="pagination"
                    :take=take
                    :currentPage=currentPage
                    :pageGap="7"
                    :endButton="true"
                    :startButton="true"
                    v-on:page-change="pageChangeEvt"
                />   -->
                <!-- ! The general rule is to write attributes in kebab-case, just like in vanilla HTML -->
                <NewPagination
                    v-model:take=take
                    v-model:skip="skip"
                    :current-page=currentPage
                    :page-gap="7"
                    :end-button="true"
                    :start-button="true"
                    :element-amount="amountArticles"
                    @page-change="pageChangeEvt"
                />
            </div> 
        </div>
    </div> 
       
</template>

<script lang="ts">

    import { defineComponent }             from 'vue';
    import Pagination                      from '@/components/crudComponent/Pagination.vue';
    import NewPagination                   from "@/components/Pagination/Pagination.vue";
    import TopMenu                         from "@/components/TopMenu/TopMenu.vue";
    import PopupWrapper                    from "@/components/Popup/PopupWrapper.vue";
    import FlashMessageData                from '../../libs/flashMessage';
    import Table                           from "@/components/table/Table.vue";
    import { Column, Action, TableConfig } from "@/components/table/types";
    // import axios               from '../../libs/axios';
    // import { AxiosResponse }   from 'axios';
    import ArticleService      from '../../services/ArticleService';
    import { LinkButton } from '@/components/TopMenu/types';

    export default defineComponent({

        components: {
            // Pagination,
            TopMenu,
            NewPagination,
            PopupWrapper,
            Table,
        },

        data: function(){
            return {
                articles      : [] as Array<Record<string, unknown>>,
                topMenuButtons: [
                    { name: "Test", path: "/kek" },
                    { name: "Lol",  path: "/lol" }
                ] as Array<LinkButton>,
                columnNames   : [ 
                        { displayedName: "Id",      fieldName: "id" },
                        { displayedName: "Title",   fieldName: "title" },
                        { displayedName: "Type",    fieldName: "t_title", columnHandler: (val: string) => val.toUpperCase() },
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
                tableConfig: { sortableByColumn: true, hideColumn: [], dropDownActions: true } as TableConfig,
                take          : 10 as number,
                skip          : 0 as number,
                currentPage   : 1 as number,
                amountArticles: 0 as number, 
                showPopup     : false as boolean,
            }
        },


        mounted: async function(){
            await this.getArticles({take: this.take, skip: this.skip});
            await this.getArticlesAmount();
        },

        
        methods: {
            
            getArticles: async function(data: {take: number; skip: number}){
                this.articles = await ArticleService.getAll(data) || [];
            },

            getArticlesAmount: async function(){
                this.amountArticles = await ArticleService.getAmount() || 0;
                // const pagination = this.$refs.pagination! as any;
                // pagination.setAmountElements(this.amountArticles);
            },

            // pageChangeEvt: function(data: {take: number; skip: number}){
            //     this.getArticles(data);
            // },

            pageChangeEvt: function(){
                this.getArticles({ take: this.take, skip: this.skip });
            },

            removeArticle: async function(id: number){
                await ArticleService.removeOne({id: id});
                
                // const pagination = this.$refs.pagination! as any;
                // pagination.setAmountElements(this.amountArticles--);
                this.amountArticles--;
                this.getArticles({take: this.take, skip: this.skip});

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of article', `Article with id = ${id} was removed`));
            }

        },
    });

</script>