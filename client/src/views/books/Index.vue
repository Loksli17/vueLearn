<template>
    <div class="books-index">

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link class="create-btn" :to="'/books-crud/create'">Create book</router-link>
        </div>

        <div>
            <!-- {{books}} -->
            <Table 
                :column-names="tableHeader" 
                :config="tableConfig"
                :row-data="books"
                :column-handlers="tableColumnHandlers"
                v-model:selected-rows="selectedRows" />

            <Table 
                :column-names="tableHeader" 
                :row-data="selectedRows" />

            
            <!-- <VueTable 
                :columns="tableHeader" 
                :config="tableConfig"
                :row-data="selectedRows"
                :column-handlers="tableColumnHandlers" /> -->
        </div>

        <InRange 
            v-model="selectedRows.length" 
            :editable="false"
            :total="books.length" />

        <div class="pagination-wrap">
            <Pagination 
                v-model:take=take
                v-model:skip="skip"
                :page-gap="7"
                :end-button="true"
                :start-button="true"
                :element-amount="amountBooks"
            />
        </div>
    </div>

    <FloatingButton position="right" :side="80" :bottom="80">
        <AddButton @clicked="clickHandler" />
    </FloatingButton>
</template>



<script lang="ts">
    import { defineComponent }                 from 'vue';
    import moment                              from 'moment';
    import BooksService                        from '../../services/BooksService';
    import FloatingButton                      from "@/components/FloatingButton/FloatingButton.vue"
    import AddButton                           from "@/components/FloatingButton/AddButton.vue";
    import Pagination                          from '@/components/Pagination/Pagination.vue';
    import InRange                             from "@/components/InRange.vue"
    import Table                               from "@/components/table/Table.vue";

    // import VueTable                            from "@/components/NewTable/VueTable.vue";
    

    import { Column, TableColumnHandler, SortOrder,TableConfig } from "@/components/table/types";


    export default defineComponent({

        components: {
            Table,
            // VueTable,
            FloatingButton,
            AddButton,
            Pagination,
            InRange
        },

        data: function(){
            return {
                books      : [] as Array<Record<string, unknown>>,
                amountBooks: 0 as number | null,
                
                tableHeader: [
                    { fieldName: "id",          displayedName: "ID" },
                    { fieldName: "title",       displayedName: "Title" },
                    { fieldName: "writingDate", displayedName: "Created on" },
                    { fieldName: "isCompleted", displayedName: "Status" },
                ] as Array<Column>,

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
                        fieldName: "writingDate",
                        columnComparator: (val1: string, val2: string) => {
                            const 
                                t1 = moment(val1, "MMMM Do YYYY").toDate(),
                                t2 = moment(val2, "MMMM Do YYYY").toDate();
                            console.log(t1, t2);
                            if (t1 < t2) return -1;
                            if (t1 > t2) return 1;
                            return 0;
                        }
                    }
                ] as Array<TableColumnHandler>,
                
                tableConfig: {
                    sortableByColumn: { default: SortOrder.ASCENDING },
                    dropDownActions: true,
                    selectableRows: true
                } as TableConfig,

                selectedRows: [] as Array<Record<string, unknown>>,
                take        : 10 as number,
                skip        : 0 as number,
            }
        },
        
        mounted: async function(){
            this.skip = (Number(this.$route.query.page) - 1) * 10; //! it's a bad way? 
            await this.getBooks({skip: this.skip, take: this.take});
            await this.getAmountBooks();
        },

        methods: {

            //todo write BlackLirium about his mistakes
            getBooks: async function(data: Record<string, unknown>){
                this.books = await BooksService.getAll(data) || [];
            },

            getAmountBooks: async function(){
                this.amountBooks = await BooksService.getAmount();
            },

            clickHandler(): void {
                alert('Oi mate, ya pressed the button')
            }
        }
    })
</script>

<style lang="scss">
    @import "@/assets/scss/checkbox/checkbox.scss";
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line{
        @extend %add-line;

        a{
            @extend %button;
        }

        .create-btn{
            @extend %create-button;
        }
    }
</style>