<template>
    <div class="crud-index">
        <h1>View item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/crud'">Go index-crud</router-link>
        </div>

        <div class="buttons-wrap">
            <router-link :to="'/crud/create'">Create item</router-link>
        </div>

        <div class="table-wrap">
            <GridView
                v-if="article"
                :data="article"
                :fields="fields"
                :keysHandler="this.$filters.upperFirst"
            />
        </div>

        <div>
            <!-- <img :src="require('@/assets')" alt=""> -->
        </div>
    </div>    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import axios             from '../../libs/axios';
    import { AxiosResponse } from 'axios';
    import GridView          from '../../components/crudComponent/GridView.vue';
    import ArticleService    from '../../services/ArticleService';

    export default defineComponent({

        components: {
            GridView,
        },

        data: function(){
            return {
                id     : 0 as number,
                article: {} as Record<string, any> | null,
                fields : {'t_title': 'Type of article'},
            }
        },

        mounted: async function(){
            this.id      = Number(this.$route.params.id);
            this.article = await ArticleService.getOneView({id: this.id});
        },
    });

</script>