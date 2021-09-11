<template>
    <form :class=className :id=id @submit.prevent="emitFormData">

        <div class="form-row" v-for="row in rows" :key='row'>

            <div v-for="item in row" :key='item.name'>
                <label v-if="item.type != 'hidden'" :class="{'error': errors && errors[item.name]}" class="form-col">
                    
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

                    <!-- <DropDownList v-else-if="item.type == 'select'"
                        :name="item.name"
                        :listItems="item.options"
                        :search="item.search"
                        :disabledOption="item.disabledOption"
                        :required="item.required"
                        :currentItem="item.currentItem"
                        v-on:emitValue="setItemValue"
                    /> -->

                    <DropList
                        v-else-if="item.type == 'select' && item.options.length"
                        :optionsList="item.options"
                        v-model:current-option-id="localDataForm[item.name]"
                        :disabledOption="item.disabledOption"
                    />


                    <Checkbox v-else-if="item.type == 'checkbox'"
                        :name="item.name"
                        :value="localDataForm[item.name]"
                        v-on:emitValue="setItemValue"
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

                    <!-- <em>{{errors[item.name]}} {{errors}} {{item.name}}</em> -->
                    <div v-if="errors && errors[item.name]" class="error-msg">{{errors[item.name]}}</div>
                </label>
            </div>

        </div>
    </form>
</template>


<script lang="ts">

    import Checkbox            from '../crudComponent/Checkbox.vue';
    import DropList            from "../dropDown/DropDown.vue";
    import { ListItem }        from "../dropDown/types";
    import { defineComponent } from 'vue';


    export interface FormHtmlItem{
        type: string;
        name: string;
        error?: string;

        //input
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
        selected?: string | number;
        multiple?: boolean;
        search?: boolean;
        disabledOption?: string;
        options?: Array<ListItem>;
        currentItem?: string | number | ListItem;

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

    export interface FormErrors{
        [index: string]: string,
    }


    export default defineComponent({

        components: {
            Checkbox,
            DropList
        },

        data: function(){
            return {
                //! this property i wanted to do computed, but it doesn't work correctly
                localDataForm: Object.assign({}, this.data as unknown) as FormData,
            }
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
                type   : Object as () => FormData,
                default: () => null,
            },
            errors: {
                type   : Object as () => FormErrors,
                default: () => null,
            }
        },

        created: function(){
            this.validateFormRows();
        },

        methods: {

            emitFormData: function(){
                this.$emit('send', this.localDataForm);
            },

            validateFormRows: function(){

                //! check this props attentivle
                const 
                    selectProp: Array<string> = [
                        'name',
                        'type',
                        'error',
                        'label',

                        'selected',
                        'options',
                        'multiple',
                        'disabledOption',
                        'search',
                        'currentItem'
                    ],
                    inputProp: Array<string> = [
                        'name',
                        'type',
                        'error',
                        'label',

                        'max',
                        'min',
                        'pattern',
                        'required',
                        'disabled',
                        'readonly',
                        'placeholder',
                        'step',
                        'autocomplete',
                        'autofocus',
                    ],
                    textProp: Array<string> = [
                        'name',
                        'type',
                        'error',
                        'label',

                        'cols',
                        'maxLength',
                        'rows',
                        'tabIndex',
                        'wrap',
                    ],
                    checkboxProp: Array<string> = [
                        'name',
                        'type',
                        'error',
                        'label',
                    ];

                const checkInclude = (htmlItem: FormHtmlItem, props: Array<string>, rowInd: number, itemInd: number) => {
                    for(const key in htmlItem){
                        if(!props.includes(key)){
                            throw new Error(`Error with ROWS of FORM in row: ${rowInd} and elem: ${itemInd} with prop: ${key}`);
                        }
                    }
                };
                
                this.rows.forEach((row, i) => {
                    row.forEach((htmlItem, j) => {    
                        switch(htmlItem.type){
                            case 'select':
                                checkInclude(htmlItem, selectProp, i, j);
                                break;
                            case 'textarea':
                                checkInclude(htmlItem, textProp, i, j);
                                break;
                            case 'checkbox':
                                checkInclude(htmlItem, checkboxProp, i, j);
                                break;
                            default:
                                checkInclude(htmlItem, inputProp, i, j);
                        }
                    });
                });
            },

            // ! it can be bad
            // ? may be try to do localDataFrom is computed?
            setItemValue: function(val: any, name: string | number){
                this.localDataForm[name] = val;
            },

            
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