<template>
    
    <div class="animals-create">

        <h1>Create item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/animals'">Go index-crud</router-link>
        </div>


        <div class="form-wrap">

            <div class="form-wrap">
                <Form 
                    v-if="scheme"
                    :scheme="scheme"
                    :data="formData"
                    :tableName="'animal'"
                    :errors="formErrors"
                    v-on:send="sendForm"
                />
            </div>
        </div>
    </div>

</template>


<script lang="ts">
    import { defineComponent }                        from 'vue';
    import Form                                       from '../../components/Form/newForm.vue';
    import { FormDataView, FormHtmlItem, FormErrors } from '../../components/Form/types';
    import AnimalService                              from '../../services/AnimalService';
    import { AxiosResponse }                          from 'axios';
    import FlashMessageData                           from '../../libs/flashMessage';


    export default defineComponent({

        components: {
            Form,
        },
        
        data(){
            return {
                scheme    : null as Array<Array<FormHtmlItem>> | null,
                formData  : null as FormDataView | null,
                formErrors: null as FormErrors | null,
                filename: "" as string
            }
        },

        mounted: async function(){
            this.initScheme();
            this.initFormData();
        },

        methods: {
            
            initScheme: function() {
                this.scheme = [
                    [{type: 'text', name: 'name', label: 'Name'}, {type: 'text', name: 'type', label: 'Type'}],
                    [{type: 'submit', name: 'sendAnimal'}]
                ];
            },

            initFormData: function(){
                this.formData = {};
            },


            sendForm: async function(data: FormDataView){
                let response: AxiosResponse | null = await AnimalService.addAnimal({animal: data});
   
                if(response == null) { console.error("Error with response"); return; }

                if(response.status == 422) {
                    this.formErrors = response.data.validationErrors;
                } else {
                    this.$flashMessage.show(FlashMessageData.successMessage('Creation animal', response.data.msg));
                }
            }
        }
    })
</script>


<style lang="scss">
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line{
        @extend %add-line;

        a{
            @extend %button;
        }

        .create-btn{
            @extend %create-button;
        }
    }
</style>