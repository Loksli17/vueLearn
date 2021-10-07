<template>
    <div class="books-index">
        <div>
            <!-- {{books}} -->
            <Table 
                :column-names="tableHeader" 
                :config="tableConfig"
                :row-data="books"
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
    import { TableConfig, Column, SortOrder }  from "@/components/table/types";
    import FloatingButton                      from "@/components/FloatingButton/FloatingButton.vue"
    import AddButton                           from "@/components/FloatingButton/AddButton.vue";

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
                tableConfig: {
                    sortableByColumn: { default: SortOrder.ASCENDING },
                    dropDownActions: true,
                    selectableRows: true
                } as TableConfig,
                selectedRows: [] as Array<Record<string, unknown>>,
                take : 10 as number,
                skip : 0 as number,
            }
        },
        
        mounted: async function(){
            await this.getBooks({skip: this.skip, take: this.take});
        },

        methods: {

            getBooks: async function(data: Record<string, unknown>){
                this.books = await BooksService.getAll(data) || [];
                console.log("Books:", this.books);
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