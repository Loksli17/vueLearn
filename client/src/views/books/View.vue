<template>
    <div class="books-view">
        <div>
            {{book}}
        </div>
    </div>
</template>


<script lang="ts">

    import { defineComponent } from 'vue';
    import BooksService        from '../../services/BooksService';

    export default defineComponent({       

        data: function(){
            return {
                id     : 0 as number,
                book: {} as Record<string, any> | null,             
            }
        },

        mounted: async function(){
            this.id = Number(this.$route.params.id);            
            this.book = await BooksService.getOne({id: this.id});           
        },
    });

</script>