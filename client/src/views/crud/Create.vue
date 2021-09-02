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
                    :rows="rowsForm"
                    :tableName="article"
                />
            </div>

            <DropDownList 
                ref="dropList"
                :listItems="types"
            />

        </div>

    </div>    
</template>


<script lang="ts">
    import { defineComponent }        from 'vue';
    import axios                      from '../../libs/axios';
    import DropDownList, { ListItem } from '../../components/DropDownList.vue';
    import Form, { FormItem }         from '../../components/crudComponent/newForm.vue';
    import { AxiosResponse }          from 'axios';
    
    interface ArtcleType{
        value?: string;
        id    : number;
        title?: string;
    }

    export default defineComponent({

        components: {
            DropDownList,
            Form,
        },

        data: function(){
            return {
                types         : [] as Array<ArtcleType>,
                currentValueId: 0 as number,
                article       : {} as Record<string, unknown>,
                rowsForm      : null as Array<Array<FormItem>> | null,
            }
        },

        created: async function(){
            await this.getTypes();
            this.initRowsForm();
            // console.log(this.$filters.dateToDb(new Date()));
            // this.rowsForm[1][0].value = this.$filters.dateToDb(new Date());
            // this.rowsForm[1][1].value = this.$filters.timeToDb(new Date());
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
                    // [{type: 'select', name: 'articleTypeId', label: 'Article`s type', options: this.types}],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            // formInit: function(){
            //     this.rowsForm[3][0].options = (this.types as Array<ListItem>);
            //     this.rowsForm[1][0] = new Date();
            //     this.rowsForm[1][1] = new Date();
            // },
        },
    });
</script>