<template>
    <tr>
        <td v-for="(value, name) in row" :key="name">{{ value }}</td>
        <TableRowActionCell v-if="actions" :actions="actions" :itemId="row.id" />
    </tr>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import TableRowActionCell from "./TableRowActionCell.vue";
    import { Action, columnType } from "./types";

    export default defineComponent({
        name: "TableRow",
        components: {
            TableRowActionCell
        },
        props: {
            row: {
                type: Object as PropType<columnType>,
                require: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            }
        }
    })
</script>