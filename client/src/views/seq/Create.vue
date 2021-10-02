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
    import { defineComponent }                            from 'vue';
    import Checkbox                                       from "../../components/crudComponent/VueCheckbox.vue";
    import Form, {FormDataView, FormHtmlItem, FormErrors} from '../../components/crudComponent/newForm.vue';
    import UserService                                    from '../../services/UserService';
    import { AxiosResponse }                              from 'axios';
    import FlashMessageData                               from '../../libs/flashMessage';


    export default defineComponent({
        
        components: {
            Checkbox,
            Form,
        },

        data() {
            return {
                checked: false as boolean,
                
                scheme    : [] as Array<Array<FormHtmlItem>> | null,
                formData  : null as FormDataView | null,
                formErrors: null as FormErrors | null, 
            }
        },

        mounted: async function(){
            this.initScheme();
            this.initFormData();
        },

        methods: {

            initScheme: function(){
                this.scheme = [
                    [{type: 'text', name: 'login', label: 'Login'}, {type: 'text', name: 'email', label: 'E-mail'}],
                    [{type: 'text', name: 'password', label: 'Password'}],
                    [{type: 'submit', name: 'sendUser'}]
                ];
            },

            initFormData: function(){
                this.formData = {};
            },

            sendForm: async function(data: FormDataView){
                let response: AxiosResponse | null = await UserService.addUser({user: data});
   
                if(response == null) return;

                if(response.status == 422) {
                    this.formErrors = response.data.validationErrors;
                } else {
                    this.$flashMessage.show(FlashMessageData.successMessage('Edit user', `User with id = ${this.$route.params.id} was edit`));
                }
            }
        }

    });
</script>