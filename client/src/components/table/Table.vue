<template>
    <table border="1">
        <TableHeader :columnNames="columnNames" />
        <tbody>
            <TableRow v-for="row in rowData" :key="row.id" :row="row" :actions="actions" />
        </tbody>
        <tfoot>
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import TableHeader from './TableHeader.vue';
    import TableRow from "./TableRow.vue";
    import { Column, columnType, Action } from "./types";
   

    export default defineComponent({
        name: "Table",
        components: {
            TableHeader,
            TableRow
        },
        props: {
            columnNames: {
                type: Object as PropType<Array<Column>>,
                required: true
            },
            rowData: {
                type: Object as PropType<Array<Record<string, columnType>>>,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            }
        }
    })
</script>