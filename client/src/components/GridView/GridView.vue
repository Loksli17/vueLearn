<template>
    
    <table :class="tableClass">
        <tr :class="trClass" v-for="item in localRecord" :key=item.key>
            <td :class="tdClass">{{item.key}}</td>
            <td :class="tdClass">{{item.value}}</td>
        </tr>
    </table>
</template>


<script lang="ts">
    
    /**
     * ! can I make normilized names of fields with callback or boolean props
     * todo new data structure from data & fields
     */

    import { defineComponent, PropType } from 'vue';

    
    export default defineComponent({
        
        props: {
            data: {
                type   : Object as PropType<Record<string, unknown>>,
                default: null,
            },
            fields: {
                type   : Array as PropType<Array<string | Record<string, string>>>,
                default: null,
            },
            //? think about name
            dataHandler: {
                type   : Function,
                default: undefined,
            },
            keysHandler: {
                type   : Function,
                default: undefined,
            },
            capitaliseFieldName: {
                type   : Boolean,
                default: true,
            },

            tableClass: {
                type   : String,
                default: 'grid-view-table',
            },
            trClass: {
                type   : String,
                default: 'grid-view-tr',
            },
            tdClass: {
                type   : String,
                default: 'grid-view-td',
            }
        },

        computed: {
            localRecord: function(): Array<Record<string, unknown>>{
                
                const record: Array<{key: string, value: string}> = [];

                for(let i = 0; i < this.fields.length; i++){
                    if(typeof this.fields[i] == 'string'){
                        //*string
                        const field: string = this.capitaliseFieldName ? this.doUpperFirstLetter(this.fields[i] as string) : this.fields[i] as string;
                        record.push({
                            key: field, 
                            value: this.data[this.fields[i] as string] as string
                        });
                    
                    }else if(typeof this.fields[i] == 'object'){
                        //*object
                        for (const key in (this.fields[i] as Record<string, string>)){
                            if(Object.prototype.hasOwnProperty.call(this.fields[i], key)){
                                const field: string = (this.fields[i] as Record<string, string>)[key];
                                record.push({
                                    key: field, 
                                    value: this.data[key] as string
                                });
                            }
                        }

                    }  
                }

                return record;
            },
        },

        methods: {

            doUpperFirstLetter: function(str: string){
               return str[0].toUpperCase() + (str.slice(1, (str.length)));
            }
        },
    });

</script>


<style lang="scss" scoped>
    @import 'style.scss';
</style>