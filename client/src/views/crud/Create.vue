<template>
    <div class="crud-index">
        <h1>Create item page</h1>

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

    </div>    
</template>


<script lang="ts">
    import { defineComponent }              from 'vue';
    import axios                            from '../../libs/axios';
    import Form, { FormHtmlItem, FormData } from '../../components/crudComponent/newForm.vue';
    import { AxiosResponse }                from 'axios';
    
    interface ArtcleType{
        value?: string;
        id    : number;
        title?: string;
    }

    export default defineComponent({

        components: {
            Form,
        },

        data: function(){
            return {
                types         : [] as Array<ArtcleType>,
                currentValueId: 0 as number,
                article       : {} as Record<string, unknown>,
                rowsForm      : null as Array<Array<FormHtmlItem>> | null,
                dataForm      : null as FormData | null,
            }
        },

        created: async function(){
            await this.getTypes();
            this.initRowsForm();
            this.initDataForm();
        },

        methods: {
            
            getTypes: async function(){

                await axios.get({
                    url: '/crud/article-types',
                    handler: (res: AxiosResponse) => {
                        this.types = res.data.types;
                    },
                });

                this.types.map(item => {
                    item.value = item.title;
                    delete item.title;
                    return item;
                });
            },

            initRowsForm: function(){
                this.rowsForm = [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', name: 'date'}, {type: 'time', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    // [{type: 'select', name: 'articleTypeId', label: 'Article`s type', search: true}],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            initDataForm: function(){
                this.dataForm = {
                    title        : "Name",
                    date         : this.$filters.dateToDb(new Date()),
                    time         : this.$filters.timeToDb(new Date()),
                    articleTypeId: this.types,
                    text         : "azazazaza",
                    isReady      : true,
                } as FormData;
            },

            sendForm: async function(formData: FormData){
                
                await axios.put({
                    url: 'crud/add',
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
        },
    });
</script>