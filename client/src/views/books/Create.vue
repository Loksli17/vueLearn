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

        <Checkbox
            :name="'check'"
            v-model:value="checked"
        />
    </div>

</template>

<script lang="ts">
    import { defineComponent }                        from 'vue';
    import Form                                       from '../../components/Form/newForm.vue';
    import { FormDataView, FormHtmlItem, FormErrors } from '../../components/Form/types';
    import Checkbox                                   from '../../components/Checkbox/Checkbox.vue';


    export default defineComponent({
        
        components: {
            Form,
            Checkbox,
        },

        data(){
            return {

                scheme    : null as Array<Array<FormHtmlItem>> | null,
                formData  : null as FormDataView | null,
                formErrors: null as FormErrors | null,
                animals   : [] as Array<Record<string, any>> | null,

                checked: false as boolean,
            }
        },

        mounted: async function(){
            this.initScheme();
            this.initFormData();
        },

        methods: {

            initScheme: function() {
                this.scheme = [
                    [{type: 'text', name: 'title', label: 'Tilte'}, {type: 'checkbox', toggle: true, showState: true, name: 'isCompleted', label: 'Readiness of the book'}],
                    [{type: 'date', name: 'date', label: 'Date of creation'}],
                    [{type: 'textarea', name: 'text', label: 'Text'}],
                    [{type: 'submit', name: 'sendBook'}]
                ];
            },

            initFormData: function(){
                this.formData = {isCompleted: true};
            },

            sendForm: function(){
                console.log(this.formData);
            }
        }

    });
</script>

<style lang="scss">
    
    .checkbox input:checked + .toggle {
        background-color: #4e34dd;
    }
</style>