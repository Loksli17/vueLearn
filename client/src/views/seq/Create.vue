<template>

    <div class="seq-create">

        <h1>Create item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/seq-crud'">Go index-crud</router-link>
        </div>


        <div class="form-wrap">

            <div class="form-wrap">
                <Form 
                    v-if="scheme"
                    :scheme="scheme"
                    :data="formData"
                    :tableName="'user'"
                    :errors="formErrors"
                    v-on:send="sendForm"
                />
            </div>
        </div>

        <!-- this is more native -->
        <Checkbox v-model="checked" :name="'test-checkbox'" />
        <span>{{ checked }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent }                      from 'vue';
    import Checkbox                                 from "../../components/crudComponent/VueCheckbox.vue";
    import Form                                     from '../../components/Form/newForm.vue';
    import {FormDataView, FormHtmlItem, FormErrors} from '../../components/Form/types';
    import UserService                              from '../../services/UserService';
    import { AxiosResponse }                        from 'axios';
    import FlashMessageData                         from '../../libs/flashMessage';
    import { LoadingFile }                          from '../../components/FileUpload/types';
    import { ListItem }                             from '../../components/dropDown/types';


    export default defineComponent({
        
        components: {
            Checkbox,
            Form,
        },

        data() {
            return {
                checked: false as boolean,
            
                scheme    : null as Array<Array<FormHtmlItem>> | null,
                formData  : null as FormDataView | null,
                formErrors: null as FormErrors | null,
                animals   : [] as Array<Record<string, any>> | null,

                filename: "" as string | null,
            }
        },

        mounted: async function(){
            await this.getAnimals();
            this.initScheme();
            this.initFormData();
        },

        computed: {
            options: function(): Array<ListItem>{
                return this.animals!.map((item): ListItem => {
                    const newItem: ListItem = { value: item.name, id: item.id};
                    return newItem;
                });
            }
        },

        methods: {

            getAnimals: async function() {
                this.animals = await UserService.getAnimals();
                console.log(this.options);
            },

            initScheme: function() {
                this.scheme = [
                    [{type: 'text', name: 'login', label: 'Login'}, {type: 'text', name: 'email', label: 'E-mail'}],
                    [{type: 'text', name: 'password', label: 'Password'}],
                    [{type: 'select', name: 'animalId', label: 'Animal', options: this.options}],
                    [{
                        type          : 'file', 
                        name          : 'avatar', 
                        label         : 'Avatar', 
                        maxFilesAmount: 1, 
                        maxFileSize   : 1024 * 1024 * 1, 
                        autoLoad      : true,  
                        types         : ['png', 'jpg', 'jpeg'],
                        
                        loadHandler   : this.imagesLoad,
                        fileSizeError : this.fileSizeError,
                        fileTypeError : this.fileTypeError,
                        dragAndDropCapableError: this.dragAndDropCapableError,
                    }],
                    [{type: 'submit', name: 'sendUser'}]
                ];
            },

            initFormData: function(){
                this.formData = {};
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

            sendForm: async function(data: FormDataView){
                data.avatar = this.filename!;
                let response: AxiosResponse | null = await UserService.addUser({user: data});
   
                if(response == null) { console.error("Error with response"); return; }

                if(response.status == 422) {
                    this.formErrors = response.data.validationErrors;
                } else {
                    this.$flashMessage.show(FlashMessageData.successMessage('Edit user', `User with id = ${this.$route.params.id} was edit`));
                }
            }
        }

    });
</script>