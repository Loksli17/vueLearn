<template>
    <div class="wrapper">
        <Form
            :rows="rowsForm"
            v-on:send="sendForm"
            :errors="formErrors"
        />
    </div>
</template>


<script lang="ts">

    import axios                                              from '../libs/axios';
    import { defineComponent }                                from 'vue';
    import Form, { FormHtmlItem, FormData as FD , FormErrors} from '../components/crudComponent/newForm.vue';
    import { AxiosResponse }                                  from 'axios';
    import axiosOrigin                                        from 'axios';


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

            sendForm: async function(formData: FD){
                
                await axios.post({
                    url                    : '/auth/login',
                    data                   : formData,
                    status                 : 200,
                    errorServerFlashMessage: false,

                    handler: (res: AxiosResponse) => {
                        this.formErrors = null;

                        this.$store.commit('setUserIdentity', res.data.user);
                        this.$store.commit('setJWT', res.data.accessToken);

                        this.$router.push({name: 'Home'});
                        axiosOrigin.defaults.headers.common['Authorization'] = this.$store.getters.getJWT;
                    },

                    errorHandler: (err) => {
                        this.formErrors = err.response.data.errors;
                        console.log('err res:', this.formErrors);
                    }
                });
            },
        }
    });

</script>