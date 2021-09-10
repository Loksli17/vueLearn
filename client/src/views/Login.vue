<template>
    <div class="wrapper">
        <Form
            :rows="rowsForm"
            v-on:send="sendForm"
        />
    </div>
</template>


<script lang="ts">

    import axios                                from '../libs/axios';
    import {defineComponent}                    from 'vue';
    import Form, {FormHtmlItem, FormData as FD} from '../components/crudComponent/newForm.vue';
    import { AxiosResponse }                    from 'axios';


    export default defineComponent({
        
        components: {
            Form,
        },    
        
        data: function(){
            return {
                rowsForm: null as Array<Array<FormHtmlItem>> | null
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
                    url : '/auth/authentification',
                    data: formData,
                    handler: (res: AxiosResponse) => {
                        console.log(res);
                    }
                })
            },
        }
    });

</script>