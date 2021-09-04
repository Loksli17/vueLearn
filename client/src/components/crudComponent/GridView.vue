<template>
    
    <table>
        <tr v-for="(value, index) in localRecord" :key=index>
            <td>{{fields[index] || index}}</td>
            <td>{{value}}</td>
        </tr>
    </table>
</template>


<script lang="ts">
    
    /**
     * ! can I make normilized names of fields with callback or boolean props
     */

    import {defineComponent} from 'vue';
    
    export default defineComponent({
        
        props: {
            data: {
                type   : Object as () => Record<string, unknown>,
                default: null,
            },
            fields: {
                type   : Object as () => Record<string, unknown>,
                default: null,
            },
            fieldsHandler: {
                type   : Function,
                default: undefined,
            },
        },

        computed: {
            localRecord: function(): Record<string, unknown>{
                
                const record: Record<string, unknown> = {};

                if(this.fieldsHandler){
                    for (const key in record) {
                        if (Object.prototype.hasOwnProperty.call(record, key)) {
                            record[key] = this.fieldsHandler(record[key]);
                        }
                    }
                }

                return Object.assign({}, this.data);
            }
        },
    });

</script>

<style lang="scss" scoped>

    table, th, td{
        border: 2px solid;
    }

    table{
        margin-top: 20px;
        border-collapse: collapse;
        // border: 1px solid;

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