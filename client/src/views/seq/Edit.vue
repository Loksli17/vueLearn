
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
                    v-on:send="sendForm"
                />
            </div>
        </div>
    </div>
</template>


<script lang="ts">
    import { AxiosResponse }                    from 'axios';
    import { defineComponent }                  from 'vue';
    import Form, { FormHtmlItem, FormDataView } from '../../components/crudComponent/newForm.vue';
    import UserService                          from '../../services/UserService';
    import FlashMessageData                     from '../../libs/flashMessage';


    export default defineComponent({

        components: {
            Form,
        },
        
        data: function(){
            return {
                user    : {} as Record<string, any> | null,
                scheme  : [] as Array<Array<FormHtmlItem>> | null,
                dataForm: null as FormDataView | null, 
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
                    [{type: 'text', name: 'login', label: 'Login'}, {type: 'text', name: 'email', label: 'email'}],
                    [{type: 'submit', name: 'sendUser'}]
                ]
            },

            initFormData: function(){
                this.dataForm = this.user as FormDataView;
            },

            sendForm: async function(data: FormDataView){
                await UserService.editUser({user: data}, Number(this.$route.params.id));
                this.$flashMessage.show(FlashMessageData.successMessage('Edit user', `User with id = ${this.$route.params.id} was edit`));
            }
        },
    });
</script>


