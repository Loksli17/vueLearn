<template>
    
    <div class="crud-index">

        <TopMenu :buttons="topMenuButtons" slide-from="bottom">
            <template #left>
                <!-- 👀 -->
                <img width="30" src="./../../assets/img/logo.png" alt="">
            </template>
            <template #right>
                <input type="search" name="" id="">
            </template>
        </TopMenu>

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
                <ModalWrapper 
                    v-model:show-modal="showPopup" 
                    :transition-name="'modal-zoom'">
                    <div>
                        <h1>header</h1>
                        <div>
                            content
                        </div>
                        <button @click="showPopup = false">close</button>
                    </div>
                </ModalWrapper>
            </div>

            <div class="table-wrap">
                <Table
                    v-if="articles"
                    :column-names="columnNames" 
                    :row-data="articles" 
                    :actions="tableActions"
                    :config="tableConfig"
                    :column-handlers="tableColumnHandlers" >
                    <template #footer>
                        <div> This is a footer </div>
                    </template>
                </Table> 
            </div>

            <div class="pagination">
                <!-- ! The general rule is to write attributes in kebab-case, just like in vanilla HTML -->
                <Pagination
                    v-model:take=take
                    v-model:skip="skip"
                    :page-gap="7"
                    :end-button="true"
                    :start-button="true"
                    :element-amount="amountArticles"
                />
            </div> 
        </div>
    </div> 
       
</template>

<script lang="ts">

    import { defineComponent } from 'vue';
    import Pagination          from "@/components/Pagination/Pagination.vue";
    import TopMenu             from "@/components/TopMenu/TopMenu.vue";
    import { LinkButton }      from "@/components/TopMenu/types";
    import ModalWrapper        from "@/components/Modal/ModalWrapper.vue";
    import FlashMessageData    from '../../libs/flashMessage';
    import Table               from "@/components/table/Table.vue";
    import ArticleService      from '../../services/ArticleService';
    import moment              from 'moment';
    
    import { Column, Action, TableConfig, TableColumnHandler, SortOrder } from "@/components/table/types";

    export default defineComponent({

        components: {
            Pagination,
            ModalWrapper,
            Table,
            TopMenu,
        },

        data: function(){
            return {
                articles      : [] as Array<Record<string, unknown>>,
                topMenuButtons: [
                    { name: "crud",      path: "/crud" },
                    { name: "seq-crud",  path: "/seq-crud" },
                    { name: "long text", path: "/long" }
                ] as Array<LinkButton>,

                columnNames   : [ 
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
                        { name: "View",   path: (id: number) => `/crud/${id}/view`, iconPath: require("./../../assets/img/table-icons/view.svg") }, 
                        { name: "Edit",   path: (id: number) => `/crud/${id}/edit`, iconPath: require("./../../assets/img/table-icons/edit.svg") }, 
                        { name: "Delete", handler: this.removeArticle,              iconPath: require("./../../assets/img/table-icons/delete.svg") },
                ] as Array<Action>,

                tableConfig: { 
                    sortableByColumn: { default: SortOrder.DESCENDING }, 
                    // hideColumn: [], 
                    dropDownActions: true 
                } as TableConfig,

                tableColumnHandlers: [
                    {
                        fieldName: "id",
                        columnComparator: (val1: number, val2: number) => {
                            if (val1 < val2) return -1;
                            if (val1 > val2) return 1;
                            return 0;
                        }
                    },
                    { 
                        fieldName: "time", 
                        columnComparator: (val1: string, val2: string) => {
                            const 
                                t1 = moment(val1, "HH:mm A").toDate(),
                                t2 = moment(val2, "HH:mm A").toDate();

                            if (t1 < t2) return -1;
                            if (t1 > t2) return 1;
                            return 0;
                        } 
                    },
                    {
                        fieldName: "t_title",
                        columnHandler: (val: string) => val.toUpperCase()
                    },
                    {
                        fieldName: "date",
                        columnComparator: (val1: string, val2: string) => {
                            const 
                                t1 = moment(val1, "MMMM Do YYYY").toDate(),
                                t2 = moment(val2, "MMMM Do YYYY").toDate();

                            if (t1 < t2) return -1;
                            if (t1 > t2) return 1;
                            return 0;
                        }
                    }
                ] as Array<TableColumnHandler>,
                take          : 10 as number,
                skip          : 0 as number,
                currentPage   : 1 as number,
                amountArticles: 0 as number, 
                showPopup     : false as boolean,
            }
        },


        mounted: async function(){
            this.skip = (Number(this.$route.query.page) - 1) * 10;
            await this.getArticles({take: this.take, skip: this.skip});
            await this.getArticlesAmount();
        },

        
        methods: {
            
            getArticles: async function(data: {take: number; skip: number}){
                this.articles = await ArticleService.getAll(data) || [];
            },

            getArticlesAmount: async function(){
                this.amountArticles = await ArticleService.getAmount() || 0;
            },

            removeArticle: async function(id: number){
                await ArticleService.removeOne({id: id});
                
                this.amountArticles--;
                this.getArticles({take: this.take, skip: this.skip});

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of article', `Article with id = ${id} was removed`));
            }

        },
    });

</script>

<style lang="scss">

    // this is how we animate the modal window
    .modal-wrapper-background {
        opacity: 1;
    }
    .modal-wrapper-body {
        transform: scale(1);
    }

    .modal-zoom-enter-active,
    .modal-zoom-leave-active {
        transition: all .3s;

        .modal-wrapper-background {
            transition: opacity .3s;
        }

        .modal-wrapper-body {
            transition: transform .3s;
        }
    }

    .modal-zoom-enter-from,
    .modal-zoom-leave-to {
        .modal-wrapper-background {
            opacity: 0;
        }

        .modal-wrapper-body {
            transform: scale(0);
        }
    }
</style>