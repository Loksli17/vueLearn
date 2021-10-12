<template>
    
    <table>
        <tr v-for="item in localRecord" :key=item.key>
            <td>{{item.key}}</td>
            <td>{{item.value}}</td>
        </tr>
    </table>
</template>


<script lang="ts">
    
    /**
     * ! can I make normilized names of fields with callback or boolean props
     * todo new data structure from data & fields
     */

    import {defineComponent} from 'vue';

    
    export default defineComponent({
        
        props: {
            data: {
                type   : Object as () => Record<string, unknown>,
                default: null,
            },
            fields: {
                type   : Array as () => Array<string | Record<string, string>>,
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
            upperFirstLetter: {
                type   : Boolean,
                default: true,
            }
        },

        computed: {
            localRecord: function(): Array<Record<string, unknown>>{
                
                const record: Array<{key: string, value: string}> = [];

                for(let i = 0; i < this.fields.length; i++){
                    if(typeof this.fields[i] == 'string'){
                        //*string
                        const field: string = this.upperFirstLetter ? this.doUpperFirstLetter(this.fields[i] as string) : this.fields[i] as string;
                        record.push({
                            key: field, 
                            value: this.data[this.fields[i] as string] as string
                        });
                    
                    }else if(typeof this.fields[i] == 'object'){
                        //*object
                        for (const key in this.fields[i] as any){
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

    table, th, td{
        border: 2px solid;
    }

    table{
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;

        td{
            padding: 10px;
            font-size: 20px;
        }

        tr:nth-child(even){
            background: ghostwhite;
        }

        tr:nth-child(odd){
            background: lavender;
        }
    }

</style>