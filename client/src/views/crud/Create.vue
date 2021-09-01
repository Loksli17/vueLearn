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

            <Checkbox/>
        </div>

    </div>    
</template>


<script lang="ts">
    import {defineComponent}          from 'vue';
    import axios                      from '../../libs/axios';
    import DropDownList, { ListItem } from '../../components/DropDownList.vue';
    import Form, {FormItem}           from '../../components/crudComponent/Form.vue';
    import { AxiosResponse }          from 'axios';
    import Checkbox                   from '../../components/crudComponent/Checkbox.vue';
    
    interface ArtcleType{
        value?: string;
        id    : number;
        title?: string;
    }

    export default defineComponent({

        components: {
            DropDownList,
            Form,
            Checkbox,
        },

        data: function(){
            return {
                types         : [] as Array<ArtcleType>,
                currentValueId: 0 as number,
                article       : {} as Record<string, unknown>,
                rowsForm      : [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', value: '', name: 'date'}, {type: 'time', value: '', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    [{type: 'select', name: 'articleTypeId', label: 'Article`s type', options: this.types}],
                    [{type: 'submit', name: 'sendArticle', value: 'Create article'}]
                ] as Array<Array<FormItem>>
            }
        },

        created: async function(){
            await this.getTypes();
            await this.formInit();
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

            formInit: function(){
                this.rowsForm[3][0].options = (this.types as Array<ListItem>);
                // this.rowsForm[1][0] = new Date();
                // this.rowsForm[1][1] = new Date();
            },
        },
    });
</script>