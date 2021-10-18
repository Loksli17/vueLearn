<template>

    <div class="book-create">

         <h1>Create book page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/books-crud?page=1'">Go index-crud</router-link>
        </div>

        <Form 
            v-if="scheme"
            :scheme="scheme"
            :data="formData"
            :tableName="'book'"
            :errors="formErrors"
            v-on:send="sendForm"
        />
    </div>

</template>

<script lang="ts">
    import { defineComponent }                        from 'vue';
    import Form                                       from '../../components/Form/newForm.vue';
    import { FormDataView, FormHtmlItem, FormErrors } from '../../components/Form/types';


    export default defineComponent({
        
        components: {
            Form,
        },

        data(){
            return {

                scheme    : null as Array<Array<FormHtmlItem>> | null,
                formData  : null as FormDataView | null,
                formErrors: null as FormErrors | null,
                animals   : [] as Array<Record<string, any>> | null,
            }
        },

        mounted: async function(){
            this.initScheme();
            this.initFormData();
        },

        methods: {

            initScheme: function() {
                this.scheme = [
                    [{type: 'text', name: 'title', label: 'Tilte'}, {type: 'date', name: 'date', label: 'Date of creation'}, {type: 'checkbox', name: 'isCompleted', label: 'Readiness of the book'}],
                    [{type: 'textarea', name: 'text', label: 'Text'}],
                    [{type: 'submit', name: 'sendBook'}]
                ];
            },

            initFormData: function(){
                this.formData = {isCompleted: false};
            },
        }

    });
</script>