<template>
    <div class="wrapper">
        <Form
            :scheme="rowsForm"
            v-on:send="sendForm"
            :errors="formErrors"
        />
    </div>
</template>


<script lang="ts">

    import { defineComponent }                             from 'vue';
    import Form, { FormHtmlItem, FormDataView, FormErrors} from '../components/crudComponent/newForm.vue';
    import { AxiosResponse }                               from 'axios';
    import AuthService                                     from '../services/AuthService';


    export default defineComponent({
        
        components: {
            Form,
        },    
        
        data: function(){
            return {
                rowsForm  : null as Array<Array<FormHtmlItem>> | null,
                formErrors: null as FormErrors | null, 
            }
        },

        created: function(){
            this.initFormRows();
        },

        methods: {

            initFormRows: function(){
                this.rowsForm = [
                    [{type: 'email', name: 'email', label: 'E-mail'}],
                    [{type: 'password', name: 'password', label: 'Password'}],
                    [{type: 'submit', name: 'login'}],
                ]
            },

            sendForm: async function(formData: FormDataView){

                let response: AxiosResponse = await AuthService.login(formData);
                this.formErrors = response.data.errors ? response.data.errors : null;
            },
        }
    });

</script>