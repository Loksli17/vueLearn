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
                :maxFilesAmount="5"
                :autoLoad="true"
                v-on:load-handler="imageLoad"
                
                :maxFileSize="1024 * 1024 * 100"
                v-on:type-error-handler="fileTypeError"
                v-on:size-error-handler="fileSizeError"
                v-on:not-drag-and-drop-capable-error="dragAndDropCapableError"
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
    import { LoadingFile }                        from '@/components/FileUpload/types';
    import FlashMessageData                       from '../../libs/flashMessage';
    import ArticleTypeService                     from '../../services/ArticleTypeService';
    import ArticleService                         from '../../services/ArticleService';
    

    export default defineComponent({

        components: {
            Form,
            FileUpload,
        },

        data: function(){
            return {
                types         : [] as Array<Record<string, any>>,
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

            fileSizeError: function(file: LoadingFile, msg: string){
                this.$flashMessage.show(FlashMessageData.warningMessage('File loading', msg))
            },

            fileTypeError: function(file: LoadingFile, msg: string){
                this.$flashMessage.show(FlashMessageData.warningMessage('File loading', msg))
            },

            dragAndDropCapableError: function(msg: string){
                this.$flashMessage.show(FlashMessageData.errorMessage('File loading', msg));
            },
            
            getTypes: async function(){
                this.types = await ArticleTypeService.getAll() || []; 
            },

            imageLoad: async function(loadingFile: LoadingFile){
                
                const data: FormData = new FormData();
                data.append('image', loadingFile.file);
                
                await ArticleService.fileUpload(data, loadingFile);

                // await axios.post({
                //     url : `/crud/article-image`,
                //     data: data,
                //     handler: (res: AxiosResponse) => {
                //         console.log(res);
                //     },
                //     config: {
                //         onUploadProgress: (e) => {
                //             loadingFile.progress = Math.floor(e.loaded * 100 / e.total);
                //         }
                //     }
                // });
            },

            initRowsForm: function(){
                this.rowsForm = [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', name: 'date'}, {type: 'time', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    [{type: 'select', name: 'articleTypeId', label: 'Article`s type', search: true, options: this.optionsTypes, disabledOption: 'Please, choose a item'}],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            initDataForm: function(){
                this.dataForm = {
                    date         : this.$filters.dateToDb(new Date()),
                    time         : this.$filters.timeToDb(new Date()),
                    isReady      : false,
                } as FD;
            },


            sendForm: async function(formData: FD){
                
                await ArticleService.addOne({article: formData});
                this.$flashMessage.show(FlashMessageData.successMessage('Inserting of artcile', `New article was created successfully`));
            },
        },
    });
</script>