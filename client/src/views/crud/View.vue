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
                :fieldsHandler="upperFirst"
            />
        </div>
    </div>    
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import axios             from '../../libs/axios';
    import { AxiosResponse } from 'axios';
    import GridView          from '../../components/crudComponent/GridView.vue';

    export default defineComponent({

        components: {
            GridView,
        },

        data: function(){
            return {
                id     : 0 as number,
                article: {} as Record<string, unknown>,
                fields : {'t_title': 'type of article'},
            }
        },

        mounted: async function(){
            this.id = Number(this.$route.params.id);
            
            await axios.get({
                url: `/crud/${this.id}`,
                data: {id: this.id},
                handler: (res: AxiosResponse) => {
                    this.article = res.data.article;
                    this.article.date = this.$filters.dateToView(this.article.date as Date);
                }
            });
        },

        methods: {
            upperFirst: function(){
                return this.$filters.upperFirst;
            }
        }
    });

</script>