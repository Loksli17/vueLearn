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

        <div>
            <FileUpload
                :message="'Drop files here'"
                :maxSize="4"
                :repeatFiles="false"
                :autoLoad="true"
                v-on:oneLoadHandler="imageLoad"
            />
        </div>

    </div>    
</template>


<script lang="ts">
    import { defineComponent }                    from 'vue';
    import axios                                  from '../../libs/axios';
    import Form, { FormHtmlItem, FormData as FD } from '../../components/crudComponent/newForm.vue';
    import { AxiosResponse }                      from 'axios';
    import { ListItem }                           from '../../components/DropDownList.vue';
    import FileUpload                             from '../../components/FileUpload/FileUpload.vue';
    
    interface ArticleType{
        id   : number;
        title: string;
        img  : string;
    }

    export default defineComponent({

        components: {
            Form,
            FileUpload,
        },

        data: function(){
            return {
                types         : [] as Array<ArticleType>,
                currentValueId: 0 as number,
                article       : {} as Record<string, unknown>,
                rowsForm      : null as Array<Array<FormHtmlItem>> | null,
                dataForm      : null as FD | null,
            }
        },

        computed: {
            optionsTypes: function(): Array<ListItem>{
                return this.types.map((item): ListItem => {
                    const newItem: ListItem = {value: item.title, id: item.id, img: item.img};
                    return newItem;
                });
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
            },

            imageLoad: async function(file: File){
                
                const data: FormData = new FormData();
                data.append('image', file);
                console.log(data);
                
                await axios.post({
                    url : `/crud/article-image`,
                    data: data,
                    handler: (res: AxiosResponse) => {
                        console.log(res);
                    }
                })
            },

            initRowsForm: function(){
                this.rowsForm = [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', name: 'date'}, {type: 'time', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    [{type: 'select', name: 'articleTypeId', label: 'Article`s type', search: true, options: this.optionsTypes}],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            initDataForm: function(){
                this.dataForm = {
                    title        : "",
                    date         : this.$filters.dateToDb(new Date()),
                    time         : this.$filters.timeToDb(new Date()),
                    articleTypeId: /*this.types*/ 1,
                    text         : "",
                    isReady      : false,
                } as FD;
            },

            sendForm: async function(formData: FD){

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