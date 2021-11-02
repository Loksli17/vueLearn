<template>
    <div class="books-view">
        <div>
            <GridView 
                :data="book" 
                :fields="fields"
                :capitalise-field-name="false"
                table-class="book-view"
                tr-class="book-view-row"
                td-class="book-view-cell"
                 />
        </div>
    </div>
</template>


<script lang="ts">

    import { defineComponent } from 'vue';
    import BooksService        from '../../services/BooksService';
    import GridView            from "@/components/GridView/GridView.vue"

    export default defineComponent({       

        components: {
            GridView
        },

        data: function(){
            return {
                id  : 0 as number,
                // ! For fuck's sake, unknown type exists exactly for this kind of situation
                book: {} as Record<string, unknown> | null,
                fields: [
                    { "id": "ID" },
                    { "isCompleted": "Status" },
                    "text",
                    "title",
                    { "writingDate": "Created on" }
                ]     
            }
        },

        mounted: async function(){
            this.id   = Number(this.$route.params.id);            
            this.book = await BooksService.getOne({id: this.id});           
        },
    });

</script>

<style lang="scss">
    .book-view {
        border: none;
        width: 100%;
        border-collapse: collapse;

        .book-view-row {
            border-bottom: 1px solid rgb(75, 138, 105);

            &:last-of-type {
                border-bottom: none;
            }

            .book-view-cell {
                padding: 10px;

                &:first-of-type {
                    width: 1%;
                    white-space: nowrap;

                    background-color: rgb(182, 223, 202);
                }

                &:last-of-type {
                    background-color: rgb(225, 255, 240);
                }
            }
        }
    }
</style>