<template>

    <PageProgressBar /> 

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

        <div class="img-wrap">
            <img :src="`http://localhost:3000/crud/articles/${article.img}`" alt="">
        </div>

        <div class="text">
            {{article.text}}
        </div>
    </div>    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import GridView          from '../../components/GridView/GridView.vue';
    import ArticleService    from '../../services/ArticleService';
    import PageProgressBar   from '../../components/PageProgressBar.vue';


    export default defineComponent({

        components: {
            GridView,
            PageProgressBar,
        },

        data: function(){
            return {
                id     : 0 as number,
                article: {} as Record<string, any> | null,
                fields : ['id', {'t_title': 'Type of article'}, 'title', 'views', 'date', 'time', {'isReady': 'Rediness'}],
            }
        },

        mounted: async function(){
            this.id = Number(this.$route.params.id);
            const serviceResult: Record<string, any> | null = await ArticleService.getOneView({id: this.id});
            if(serviceResult == null) return;
            this.article = serviceResult!.article;
        },
    });

</script>


<style lang="scss">

    @import "../../assets/scss/page-progress-bar/page-progress-bar.scss";
    
    .img-wrap{
        width: 70%;
        margin: 40px 0px;

        img{
            width: 100%;
        }
    }

    .text{
        font-size: 26px;
    }
</style>