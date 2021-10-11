
<template>
    
    <div class="seq-edit">

        <h1>Edit item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/seq-crud'">Go index-crud</router-link>
        </div>


        <div class="form-wrap">

            <div class="form-wrap">
                <Form 
                    v-if="scheme && dataForm"
                    :scheme="scheme"
                    :data="dataForm"
                    :tableName="'user'"
                    :errors="formErrors"
                    v-on:send="sendForm"
                />
            </div>
        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent }                        from 'vue';
    import Form                                       from '../../components/Form/newForm.vue';
    import { FormHtmlItem, FormDataView, FormErrors } from '../../components/Form/types';
    import UserService                                from '../../services/UserService';
    import FlashMessageData                           from '../../libs/flashMessage';
    import { AddFile, LoadingFile}                             from '../../components/FileUpload/types';


    export default defineComponent({

        components: {
            Form,
        },
        
        data: function(){
            return {
                user      : {} as Record<string, any> | null,
                scheme    : [] as Array<Array<FormHtmlItem>> | null,
                dataForm  : null as FormDataView | null,
                formErrors: null as FormErrors | null,
                files     : [] as Array<AddFile>,
                filename  : "" as string | null,
            }
        },

        mounted: async function(){
            await this.getUser();
            this.initScheme();
            this.initFormData();
        },

        methods: {

            getUser: async function(){
                const serviceResult: Record<string, any> | null = await UserService.getOne({id: this.$route.params.id});
                if(serviceResult == null) return;
                
                this.user = serviceResult.user;

                const file = new File([new Uint8Array(serviceResult.buffer.data)], this.user!.avatar as string, {type: "text/image"});
                this.files.push({file: file, static: true});
                this.filename = file.name;
            },

            initScheme: function(){
                this.scheme = [
                    [{type: 'text', name: 'login', label: 'Login'}, {type: 'text', name: 'email', label: 'E-mail'}],
                    [{
                        type          : 'file', 
                        name          : 'avatar', 
                        label         : 'Avatar', 
                        maxFilesAmount: 1, 
                        maxFileSize   : 1024 * 1024 * 1, 
                        autoLoad      : true, 
                        files         : this.files, 
                        types         : ['png', 'jpg', 'jpeg'],
                        
                        loadHandler   : this.imagesLoad,
                        fileSizeError : this.fileSizeError,
                        fileTypeError : this.fileTypeError,
                        dragAndDropCapableError: this.dragAndDropCapableError,
                    }],
                    [{type: 'submit', name: 'sendUser'}]
                ]
            },

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
                    this.filename = await UserService.avatarUpload(data, loadingFile);
                });

            },

            initFormData: function(){
                this.dataForm = this.user as FormDataView;
            },

            sendForm: async function(data: FormDataView){
                data.avatar = this.filename || "";
                const response = await UserService.editUser({user: data}, Number(this.$route.params.id));

                if(response == null) { console.error("Error with response"); return; }

                if(response.status == 422) {
                    this.formErrors = response.data.validationErrors;
                } else {
                    this.formErrors = {};
                    this.$flashMessage.show(FlashMessageData.successMessage('Edit user', `User with id = ${this.$route.params.id} was edit`));
                }

               
            }
        },
    });
</script>


