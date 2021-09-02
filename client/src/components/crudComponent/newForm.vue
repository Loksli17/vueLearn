<template>
    <form v-if="printRows" :class=className :id=id @submit.prevent="sendData">
        <div class="form-row" v-for="row in printRows" :key='row'>

            <div v-for="item in row" :key='item.name'>
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

                    <DropDownList
                        v-else-if="item.type == 'select'"
                        :listItems="item.options"
                    />

                    <Checkbox 
                        v-else-if="item.type == 'checkbox'"
                        :value=item.value
                    />
                    
                    <input v-else :type=item.type :name=item.name 
                        v-model="item.value"
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

    import Checkbox               from '../crudComponent/Checkbox.vue';
    import DropList, { ListItem } from '../DropDownList.vue';
    import { defineComponent }    from 'vue';

    export interface FormItem{
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
                type    : Array as () => Array<Array<FormItem>>,
                required: true,
            },
        },
    });

</script>