
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
    import { AxiosResponse }                                from 'axios';
    import { defineComponent }                              from 'vue';
    import Form, { FormHtmlItem, FormDataView, FormErrors } from '../../components/crudComponent/newForm.vue';
    import UserService                                      from '../../services/UserService';
    import FlashMessageData                                 from '../../libs/flashMessage';


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
            }
        },

        mounted: async function(){
            await this.getUser();
            this.initScheme();
            this.initFormData();
        },

        methods: {

            getUser: async function(){
                this.user = await UserService.getOne({id: this.$route.params.id}) || null;
            },

            initScheme: function(){
                this.scheme = [
                    [{type: 'text', name: 'login', label: 'Login'}, {type: 'text', name: 'email', label: 'E-mail'}],
                    [{type: 'submit', name: 'sendUser'}]
                ]
            },

            initFormData: function(){
                this.dataForm = this.user as FormDataView;
            },

            sendForm: async function(data: FormDataView){
                const response = await UserService.editUser({user: data}, Number(this.$route.params.id));

                if(response == null) { console.error("Error with response"); return; }

                console.log(response);

                if(response.status == 422) {
                    this.formErrors = response.data.validationErrors;
                } else {
                    this.$flashMessage.show(FlashMessageData.successMessage('Edit user', `User with id = ${this.$route.params.id} was edit`));
                }
            }
        },
    });
</script>


