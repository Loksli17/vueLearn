<template>
    <form v-if="printRows" :class=className :id=id @submit.prevent="sendData">
        <div class="form-row" v-for="row in printRows" :key='row'>

            <template v-for="item in row" :key='item.name'>
                <label v-if="item.type != 'hidden'" :class="{'error': item.error}" class="form-col">
                    <span v-if="item.type != 'submit'">{{item.label ?? $filters.upperFirst(item.name)}}</span>
                    
                    <textarea v-if="item.type == 'textarea'" v-model="item.value" :name=item.name
                        :maxlength=item.maxLength
                        :rows=item.rows
                        :cols=item.cols
                        :wrap=item.wrap
                        :tabindex=item.tabIndex
                    >
                    </textarea>

                    <!-- <DropDownList
                        v-else-if="item.type == 'select'"
                        :listItems="item.options"
                    /> -->

                    <span>AAAAAAAAAAA</span>
                    

                    <Checkbox 
                        v-else-if="item.type == 'checkbox'"
                        :value=item.value
                    />

                    <!-- <select class="custom-select" v-else-if="item.type == 'select'" v-model="item.selected" :name=item.name :multiple=item.multiple :disabled=item.disabled>
                        <option v-for="option in item.options" :key="option.id" :value="option.id">{{option.text}}</option>
                    </select> -->
                    
                    <input v-else :type=item.type :name=item.name v-model="item.value"
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
            </template>
        </div>
    </form>
</template>


<script lang="ts">

    import {defineComponent}        from "vue";
    import DropDownList, {ListItem} from '../DropDownList.vue';
    import Checkbox                 from '../Checkbox/Checkbox.vue';
    import DropList                 from '../dropDown/DropDown.vue';

    interface Prop{
        name: string;
        value: string;
    }

    export interface Option{
        text: string;
        id: string | number;
    }

    export interface FormItem{
        type: string;
        name: string;
        error?: string;

        //input
        value?: string | number | Date;
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
        options?: Array<ListItem>;
        selected?: string | number;
        multiple?: boolean;

        //textarea
        cols?: number;
        maxLenth?: number;
        rows?: number;
        tabindex?: number;
        wrap?: string;
    }

    export default defineComponent({

        props: {
            action: {
                type: String,
            },
            successCode: {
                type: Number,
            },
            id: {
                type: String,
            },
            className: {
                type: String,
            },
            tableName: {
                type: String,
            },
            overloadParseResult: {
                type: Boolean,
            },
            overloadSendData: {
                type: Boolean,
            },
            startData: {
                type   : Object,
                default: undefined,
            },
            rows: {
                default : () => [], 
                type    : Array as () => Array<Array<FormItem>>,
                required: true,
            },
        },
        
        data(){ 
            return{
                printRows: JSON.parse(JSON.stringify(this.rows)) as Array<Array<FormItem>>,
                formData : {} as {[k: string]: any},
                result   : {} as {[k: string]: any},
            }
        },

        methods: {

            resetRows: function(){
                for(let i = 0; i < this.printRows.length; i++){
                    for(let j = 0; j < this.printRows[i].length; j++){
                        delete this.printRows[i][j].error;
                    }
                }
            },

            createPropsToSend: function(): Array<Prop> {
                const propsToSend: Array<Prop> = [];
                
                for(let i = 0; i < this.printRows.length; i++){
                    for(let j = 0; j < this.printRows[i].length; j++){
                        switch(this.printRows[i][j].type){
                            case 'submit':
                                break;
                            case 'select':
                                propsToSend.push({name: this.printRows[i][j].name, value: this.printRows[i][j].selected?.toString() || ''});
                                break;
                            case 'date':
                                propsToSend.push({name: this.printRows[i][j].name, value: this.$filters.dateToDb(this.printRows[i][j].value?.toString() || '')});
                                break;
                            case 'datetime':
                                propsToSend.push({name: this.printRows[i][j].name, value: this.$filters.datetimeToDb(this.printRows[i][j].value?.toString() || '')});
                                break;
                            case 'time':
                                propsToSend.push({name: this.printRows[i][j].name, value: this.$filters.timeToDb(this.printRows[i][j].value?.toString() || '')});
                                break;
                            default:
                                propsToSend.push({name: this.printRows[i][j].name, value: this.printRows[i][j].value?.toString() || ''});
                        }
                    }
                }
                return propsToSend;
            },

            pullFormData: function(){
                const propsToSend: Array<Prop> = this.createPropsToSend();

                if(this.tableName != undefined){
                    this.formData[this.tableName] = {};
                    for(let i = 0; i < propsToSend.length; i++){
                        this.formData[this.tableName][propsToSend[i].name] = propsToSend[i].value;
                    }              
                }else{
                    for(let i = 0; i < propsToSend.length; i++){
                        this.formData[propsToSend[i].name] = propsToSend[i].value;
                    }
                }

                if(this.startData != undefined){
                   for(const key in this.startData){
                       this.formData[key] = this.startData[key];
                   }
                }

                console.log(this.formData);
            },
           
            // sendData: async function(){
            //     this.resetRows();
            //     this.pullFormData();

            //     switch(this.typeSend){
            //         case 'axios':
            //             this.sendAxios();
            //             break;
            //     }                
            // },

            parseErrors: function(){
                for(let i = 0; i < this.result.data.errors.length; i++){
                    for(let j = 0; j < this.printRows.length; j++){
                        for(let k = 0; k < this.printRows[j].length; k++){
                            if(this.result.data.errors[i].name === this.printRows[j][k].name){
                                this.printRows[j][k].error = this.result.data.errors[i].msg;
                            }
                        }
                    }
                }
            },

            checkRows: function(){
                for(let i = 0; i < this.rows.length; i++){
                    for(let j = 0; j < this.rows[i].length; j++){
                        const 
                            selectProp: Array<string> = [
                                'name',
                                'type',
                                'error',
                                'label',

                                'selected',
                                'options',
                                'multiple',
                                'disabled',
                            ],
                            inputProp: Array<string> = [
                                'name',
                                'type',
                                'error',
                                'label',
                                'value',

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
                                'value',
                                'cols',
                                'maxLength',
                                'rows',
                                'tabIndex',
                                'wrap',
                            ];

                        switch(this.rows[i][j].type){
                            case 'select': 
                                for(const key in this.rows[i][j]){
                                    if(!selectProp.includes(key)){
                                        throw new Error(`Error select in row: ${i} and elem: ${j} with prop: ${key}`);
                                    }
                                }
                                break;
                            case 'textarea':
                                for(const key in this.rows[i][j]){
                                    if(!textProp.includes(key)){
                                        throw new Error(`Error text in row: ${i} and elem: ${j} with prop: ${key}`);
                                    }
                                }
                                break;
                            default:
                                for(const key in this.rows[i][j]){
                                    if(!inputProp.includes(key)){
                                        throw new Error(`Error input in row: ${i} and elem: ${j} with prop: ${key}`);
                                    }
                                }
                        }
                    }
                }
            },
        },

        updated: function(){
            if(this.rows) this.checkRows();
        },

        components: {
            DropDownList,
            Checkbox,
            DropList,
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