<template>
    <form :class=className :id=id @submit.prevent="validateFormData">

        <div class="form-row" v-for="row in rows" :key='row'>

            <div v-for="item in row" :key='item.name'>
                <label v-if="item.type != 'hidden'" :class="{'error': item.error}" class="form-col">
                    
                    <span v-if="item.type != 'submit'">{{item.label ?? $filters.upperFirst(item.name)}}</span>

                    <textarea v-if="item.type == 'textarea'" 
                        v-model="localDataForm[item.name]" 
                        :name=item.name
                        :maxlength=item.maxLength
                        :rows=item.rows
                        :cols=item.cols
                        :wrap=item.wrap
                        :tabindex=item.tabIndex
                    >
                    </textarea>

                    <DropDownList v-else-if="item.type == 'select'"
                        :name="item.name"
                        :listItems="localDataForm[item.name]"
                        :search="item.search"
                        :disabledOption="item.defaultMessage"
                        :required="item.required"
                    />

                    <Checkbox v-else-if="item.type == 'checkbox'"
                        :name="item.name"
                        :value="localDataForm[item.name]"
                    />

                    <input v-else-if="item.type == 'submit'" type="submit" :value="item.value || 'Send'">
                    
                    <input v-else
                        v-model="localDataForm[item.name]"
                        :type=item.type 
                        :name=item.name 
                        :max=item.max
                        :min=item.min 
                        :pattern=item.pattern
                        :required=item.required
                        :disabled=item.disabled
                        :readonly=item.readonly
                        :placeholder=item.placeholder
                        :step=item.step
                        :autocomplete=item.autocomplete
                        :autofocus=item.autofocus
                    />

                    <div v-if="item.error" class="error-msg">{{item.error}}</div>
                </label>
            </div>

        </div>
    </form>
</template>


<script lang="ts">

    import Checkbox                   from '../crudComponent/Checkbox.vue';
    import DropDownList, { ListItem } from '../DropDownList.vue';
    import { defineComponent }        from 'vue';


    export interface FormHtmlItem{
        type: string;
        name: string;
        error?: string;

        //input
        // value?: string | number | Date;
        max?: number;
        min?: number;
        label?: string;
        placeholder?: string | number | Date;
        required?: boolean;
        step?: number | string;
        disabled?: boolean;
        pattern?: RegExp;
        autofocus?: boolean;
        autocomplete?: boolean;

        //select
        // options?: Array<ListItem>;
        selected?: string | number;
        multiple?: boolean;
        search?: boolean;
        disabledOption?: string;

        //textarea
        cols?: number;
        maxLenth?: number;
        rows?: number;
        tabindex?: number;
        wrap?: string;
    }


    export interface FormData{
        [index: string]: Array<Record<string, unknown>> | string | Date | number | boolean;
    }


    export default defineComponent({

        components: {
            Checkbox,
            DropDownList,
        },
        
        props: {
            id: {
                type: String,
            },
            className: {
                type: String,
            },
            tableName: {
                type: String,
            },
            rows: {
                default : () => [], 
                type    : Array as () => Array<Array<FormHtmlItem>>,
                required: true,
            },
            data: {
                type   : FormData,
                default: null,
            }
        },

        computed: {
            localDataForm: function(): any{
                return Object.assign({}, this.data);
            }
        },

        methods: {
            validateFormData: function(){
                console.log('validateData');
            },

            validateFormRows: function(){
                console.log('validateRows');
            }
        }
    });

</script>


<style lang="scss" scoped>
    
    form{
        display: grid;
        max-width: 500px;
        margin-top: 30px;
        border: 1px dashed;

        .form-row{
            display: grid;
            grid-auto-flow: column;
            column-gap: 20px;
            padding: 20px;

            label{
                display: grid;
                row-gap: 10px;
            }
        }
    }
</style>