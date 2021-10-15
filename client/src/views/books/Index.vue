<template>
    <div class="books-index">
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
        </div>
    </div>

    <FloatingButton position="right" :side="80" :bottom="80">
        <AddButton @clicked="clickHandler" />
    </FloatingButton>
</template>



<script lang="ts">
    import { defineComponent }                 from 'vue';
    import BooksService                        from '../../services/BooksService';
    import Table                               from "@/components/table/Table.vue";
    import { TableConfig, Column, SortOrder, TableColumnHandler }  from "@/components/table/types";
    import FloatingButton                      from "@/components/FloatingButton/FloatingButton.vue"
    import AddButton                           from "@/components/FloatingButton/AddButton.vue";
    import moment                              from 'moment';


    export default defineComponent({

        components: {
            Table,
            FloatingButton,
            AddButton
        },

        data: function(){
            return {
                books: [] as Array<Record<string, unknown>>,
                tableHeader: [
                    { fieldName: "id", displayedName: "ID" },
                    { fieldName: "title", displayedName: "Title" },
                    { fieldName: "writingDate", displayedName: "Creation date" },
                    { fieldName: "isCompleted", displayedName: "Status" },
                ] as Array<Column>,

                tableColumnHandlers: [
                    {
                        fieldName: "id",
                        columnComparator: (val1, val2) => {
                            if (val1 < val2) return -1;
                            if (val1 > val2) return 1;
                            return 0;
                        }
                    },
                    { 
                        fieldName: "writingDate",
                        columnHandler: (val: string) => {
                            return moment(val, "YYYY-MM-DD").locale("pl").format("Do MMMM YYYY");
                        },
                        columnComparator: (val1, val2) => {
                            const 
                                t1 = moment(val1, "YYYY-MM-DD").toDate(),
                                t2 = moment(val2, "YYYY-MM-DD").toDate();
                            console.log(t1, t2);
                            if (t1 < t2) return -1;
                            if (t1 > t2) return 1;
                            return 0;
                        }
                    },
                    {
                        fieldName: "isCompleted",
                        columnHandler(val: boolean) {
                            return val ? "ready" : "not ready";
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
            await this.getBooks({skip: this.skip, take: this.take});
        },

        methods: {

            getBooks: async function(data: Record<string, unknown>){
                this.books = await BooksService.getAll(data) || [];
            },

            clickHandler(): void {
                alert('Oi mate, ya pressed the button')
            }
        }
    })
</script>

<style lang="scss">
    @import "@/assets/scss/checkbox/checkbox.scss";
</style>