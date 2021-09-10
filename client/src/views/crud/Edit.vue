<template>
    <div class="crud-index">
        <h1>Edit item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/crud'">Go index-crud</router-link>
        </div>


        <div class="form-wrap">

            <div class="form-wrap">
                <Form 
                    v-if="rowsForm && dataForm"
                    :rows="rowsForm"
                    :data="dataForm"
                    :tableName="'article'"
                    v-on:send="sendForm"
                />
            </div>
        </div>

        <div>
            <!-- now it's correct -->
            <!-- <DropList
                v-if="optionsTypes.length"
                :optionsList="optionsTypes"
                v-model:current-option-id="curID"
            /> -->
        </div>

    </div>    
</template>


<script lang="ts">
    
    import {defineComponent}                from 'vue';
    import axios                            from '../../libs/axios';
    import Form, { FormHtmlItem, FormData } from '../../components/crudComponent/newForm.vue';
    import { AxiosResponse }                from 'axios';
    import DropDownList, { ListItem }       from '../../components/DropDownList.vue';
    import DropList                         from '../../components/dropDown/DropDown.vue';

    interface ArticleType{
        id   : number;
        title: string;
        img  : string;
    }

    export default defineComponent({
        
        components: {
            Form,
            // DropList
        },

        data: function(){
            return {
                types   : [] as Array<ArticleType>,
                article : {} as Record<string, unknown>,
                curID   : 1,
                rowsForm: null as Array<Array<FormHtmlItem>> | null,
                dataForm: null as FormData | null, 
            }
        },

        created: async function(){
            await this.getTypes();
            await this.getArticle();
            this.initRowsForm();
            this.initDataForm();
        },

        computed: {
            optionsTypes: function(): Array<ListItem>{
                return this.types.map((item): ListItem => {
                    const newItem: ListItem = {value: item.title, id: item.id, img: item.img};
                    return newItem;
                });
            }
        },

        methods: {
            
            getTypes: async function(){

                await axios.get({
                    url: '/crud/article-types',
                    handler: (res: AxiosResponse) => {
                        this.types = res.data.types;
                    },
                });
            },

            getArticle: async function(){

                await axios.get({
                    url: `/crud/${this.$route.params.id}`,
                    handler: (res: AxiosResponse) => {
                        this.article = res.data.article;
                        console.log(this.article);
                    }
                });
            },

            initRowsForm: function(){
                this.rowsForm = [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', name: 'date'}, {type: 'time', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    [{type: 'select', name: 'articleTypeId', label: 'Article`s type', options: this.optionsTypes, currentItem: this.article.articleTypeId as number}],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            initDataForm: function(){

                this.dataForm = this.article as FormData;
                this.dataForm.date = this.$filters.dateToDb(this.article.date as string);

            },

            sendForm: async function(formData: FormData){
                
                await axios.put({
                    url: `crud/${this.$route.params.id}/edit`,
                    handler: (res: AxiosResponse) => {
                        console.log(res); // ! think about unconnect handler
                    },
                    data: {
                        article: formData
                    },
                    successFlashMessage: {
                        title: 'Inserting of artcile', 
                        text : 'New article was created successfully',
                    }
                });
            },
        }
    });
</script>