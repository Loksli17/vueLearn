<template>
    <div class="books-index">

    </div>
</template>



<script lang="ts">
    import { defineComponent } from 'vue';
    import BooksService        from '../../services/BooksService';


    export default defineComponent({

        data: function(){
            return {
                books: [] as Array<Record<string, any>>,
                take : 10 as number,
                skip : 0 as number,
            }
        },
        
        mounted: async function(){
            await this.getBooks({skip: this.skip, take: this.take});
        },

        methods: {

            getBooks: async function(data: Record<string, any>){
                this.books = await BooksService.getAll(data) || [];
                console.log("Books", this.books);
            },
        }
    })
</script>