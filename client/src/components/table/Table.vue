<template>
    <table border="1">
        <TableHeader :columnNames="columnNames" />
        <tbody>
            <TableRow v-for="row in rowData" :key="row.id" :row="row" />
        </tbody>
        <tfoot>
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import TableHeader, { Column } from './TableHeader.vue';
    import TableRow from "./TableRow.vue";

    export type columnType = string | number | boolean | Date;

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
            }
        }
    })
</script>