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
                    :scheme="rowsForm"
                    :data="dataForm"
                    :tableName="'article'"
                    v-on:send="sendForm"
                />
            </div>
        </div>

        <div>
            <FileUpload
                v-if="files.length > 0"
                :maxFilesAmount="5"
                :autoLoad="true"
                :maxFileSize="1024 * 1024 * 100"
                :types="['png', 'jpg', 'jpeg']"
                :progressBar="'different'"
                v-model:progress="progress"
                :files="files"
                
                v-on:load-handler="imagesLoad"
                v-on:type-error-handler="fileTypeError"
                v-on:size-error-handler="fileSizeError"
                v-on:not-drag-and-drop-capable-error="dragAndDropCapableError"
                v-on:continue-upload="continueUpload"
            />
        </div>

    </div>    
</template>


<script lang="ts">
    
    import {defineComponent}              from 'vue';
    import Form                           from '../../components/Form/newForm.vue';
    import { FormHtmlItem, FormDataView } from '../../components/Form/types';
    import { ListItem }                   from '../../components/DropDownList.vue';
    import ArticleTypeService             from '../../services/ArticleTypeService';
    import ArticleService                 from '../../services/ArticleService';
    import FlashMessageData               from '../../libs/flashMessage';
    import FileUpload                     from '../../components/FileUpload/FileUpload.vue';
    import { LoadingFile, AddFile }       from '../../components/FileUpload/types';


    export default defineComponent({
        
        components: {
            Form,
            FileUpload,
            // DropList
        },

        data: function(){
            return {
                types   : [] as Array<Record<string, any>>,
                files   : [] as Array<AddFile>,
                article : {} as Record<string, unknown>,
                curID   : 1,
                rowsForm: null as Array<Array<FormHtmlItem>> | null,
                dataForm: null as FormDataView | null, 
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

            fileSizeError: function(file: LoadingFile, msg: string){
                this.$flashMessage.show(FlashMessageData.warningMessage('File loading', msg))
            },

            fileTypeError: function(file: LoadingFile, msg: string){
                this.$flashMessage.show(FlashMessageData.warningMessage('File loading', msg))
            },

            dragAndDropCapableError: function(msg: string){
                this.$flashMessage.show(FlashMessageData.errorMessage('File loading', msg));
            },
        
            imagesLoad: async function(files: Array<LoadingFile>){
                
                // !Parralel variant. Sync variant work with classic for  
                files.forEach(async (loadingFile: LoadingFile) => {
                    const data: FormData = new FormData();
                    data.append('image', loadingFile.file);
                    await ArticleService.fileUpload(data, loadingFile);
                });

            },
            
            getTypes: async function(){
                this.types = await ArticleTypeService.getAll() || [];
            },

            getArticle: async function(){
                const serviceResult: Record<string, any> | null = await ArticleService.getOneDb({id: this.$route.params.id});
                if(serviceResult == null) return;
                
                this.article = serviceResult!.article;

                const file = new File([new Uint8Array(serviceResult.buffer.data)], this.article.img as string, {type: "text/image"});
                this.files.push({ file: file, static: false });
            },

            initRowsForm: function(){
                this.rowsForm = [
                    [{type: 'text', name: 'title', label: 'Title of article'}, {type: 'checkbox', name: 'isReady', label: 'Readiness of the article'}],
                    [{type: 'date', name: 'date'}, {type: 'time', name: 'time'}],
                    [{type: 'textarea', name: 'text'}],
                    [{type: 'select', name: 'articleTypeId', label: 'Article`s type', options: this.optionsTypes, currentItem: this.article.articleTypeId as number}],
                    [{
                        type          : 'file', 
                        name          : 'img', 
                        label         : 'Image', 
                        maxFilesAmount: 1, 
                        maxFileSize   : 1024 * 1024 * 1, 
                        autoLoad      : true, 
                        files         : this.files, 
                        types         : ['png', 'jpg', 'jpeg'],
                        
                        loadHandler   : this.imagesLoad,
                        fileSizeError : this.fileSizeError,
                        fileTypeError : this.fileTypeError,
                        continueUpload: this.continueUpload, 
                        dragAndDropCapableError: this.dragAndDropCapableError,
                    }],
                    [{type: 'submit', name: 'sendArticle'}]
                ]
            },

            initDataForm: function(){
                this.dataForm = this.article as FormDataView;
                this.dataForm.date = this.$filters.dateToDb(this.article.date as string);
            },

            sendForm: async function(formData: FormDataView){ 

                //! important
                // TODO: fix FORMDATA from form
                await ArticleService.editOne({article: formData});                
                this.$flashMessage.show(FlashMessageData.successMessage('Edit article', `Article with id = ${formData.id} was edit`));
            },

            continueUpload: async function(loadingFile: LoadingFile){
                const data: FormData = new FormData();
                data.append('image', loadingFile.file);
                await ArticleService.fileUpload(data, loadingFile);
            }
        }
    });
</script>