<template>
    <div class="wrapper">
        <Form
            :rows="rowsForm"
            v-on:send="sendForm"
        />
    </div>
</template>


<script lang="ts">

    import {defineComponent}    from 'vue';
    import Form, {FormHtmlItem} from '../components/crudComponent/newForm.vue';

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
                    [{type: 'email', name: 'E-mail', label: 'E-mail'}],
                    [{type: 'password', name: 'password', label: 'Password'}],
                    [{type: 'submit', name: 'login'}],
                ]
            }
        }
    });

</script>