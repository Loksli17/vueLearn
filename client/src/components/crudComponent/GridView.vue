<template>
    
    <table>
        <tr v-for="(value, index) in localRecord" :key=index>
            <td>{{fields[index] || index}}</td>
            <td>{{value}}</td>
        </tr>
    </table>
</template>


<script lang="ts">
    
    import {defineComponent} from 'vue';
    
    export default defineComponent({
        
        props: {
            data: {
                type: Object as () => Record<string, unknown>,
                default: null,
            },
            fields: {
                type: Object as () => Record<string, unknown>,
                default: null,
            },
        },

        computed: {
            localRecord: function(): Record<string, unknown>{
                return Object.assign({}, this.data);
            }
        }

    });

</script>