<template>
    <form :class=className :id=id @submit.prevent="emitFormData">

        <div class="form-row" v-for="row in scheme" :key='row'>

            <div v-for="item in row" :key='item.name'>
                <div v-if="item.type != 'hidden'" :class="{'error': errors && errors[item.name]}" class="form-col">
                    
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

                    <FileUpload v-else-if="item.type == 'file'"
                        :maxFilesAmount="item.maxFilesAmount"
                        :autoLoad="item.autoLoad"
                        :maxFileSize="item.maxFileSize"
                        :types="item.types"
                        :files="item.files"
                        
                        v-on:load-handler="item.loadHandler"
                        v-on:type-error-handler="item.fileTypeError"
                        v-on:size-error-handler="item.fileSizeError"
                        v-on:not-drag-and-drop-capable-error="item.dragAndDropCapableError"
                        v-on:continue-upload="item.continueUpload"
                    >
                    </FileUpload>

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
                        v-model:value="localDataForm[item.name]"
                        :required="item.required"
                        :toggle="item.toggle"
                        :showState="item.showState"
                        v-on:change="setItemValue"
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
                </div>
            </div>

        </div>
    </form>
</template>


<script lang="ts">

    import Checkbox                                  from '../Checkbox/Checkbox.vue';
    import DropList                                  from "../dropDown/DropDown.vue";
    import Props                                     from './props';
    import { ListItem }                              from "../dropDown/types";
    import { defineComponent }                       from 'vue';
    import { FormHtmlItem, FormDataView, FormErrors} from './types';
    import FileUpload                                from '../FileUpload/FileUpload.vue';


    export default defineComponent({

        components: {
            Checkbox,
            DropList,
            FileUpload,
        },

        data: function(){
            return {
                //! this property i wanted to do computed, but it doesn't work correctly
                localDataForm: Object.assign({}, this.data as unknown) as FormDataView,
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
            scheme: {
                default : () => [], 
                type    : Array as () => Array<Array<FormHtmlItem>>,
                required: true,
            },
            data: {
                type   : Object as () => FormDataView,
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

                const checkInclude = (htmlItem: FormHtmlItem, props: Array<string>, rowInd: number, itemInd: number) => {
                    for(const key in htmlItem){
                        if(!props.includes(key)){
                            throw new Error(`Error with ROWS of FORM in row: ${rowInd} and elem: ${itemInd} with prop: ${key}`);
                        }
                    }
                };
                
                //!!!! do it with another way
                this.scheme.forEach((row, i) => {
                    row.forEach((htmlItem, j) => {    
                        switch(htmlItem.type){
                            case 'select':
                                checkInclude(htmlItem, Props.selectProps, i, j);
                                break;
                            case 'textarea':
                                checkInclude(htmlItem, Props.textProps, i, j);
                                break;
                            case 'checkbox':
                                checkInclude(htmlItem, Props.checkboxProps, i, j);
                                break;
                            case 'file':
                                checkInclude(htmlItem, Props.fileProps, i, j);
                                break;
                            default:
                                checkInclude(htmlItem, Props.inputProps, i, j);
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

            .form-col{
                display: grid;
                row-gap: 10px;
            }
        }
    }
</style>