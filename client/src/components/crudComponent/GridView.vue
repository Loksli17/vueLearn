<template>
    
    <table>
        <tr v-for="(value, index) in localRecord" :key=index>
            <td>{{index}}</td>
            <td>{{value}}</td>
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
                type   : Object as () => Record<string, unknown>,
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
        },

        computed: {
            localRecord: function(): Record<string, unknown>{
                
                const record: Record<string, unknown> = {};

                for (const key in this.data) {
                    if (Object.prototype.hasOwnProperty.call(this.data, key)) {
                        let newKey: string = (this.fields ? (this.fields[key] || key) : key) as string;

                        newKey         = this.keysHandler ? this.keysHandler(newKey)         : newKey;
                        record[newKey] = this.dataHandler ? this.dataHandler(this.data[key]) : this.data[key];
                    }
                }

                return record;
            }
        },
    });

</script>

<style lang="scss">

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