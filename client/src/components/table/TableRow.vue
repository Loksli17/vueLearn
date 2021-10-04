<template>
    <tr>
        <template v-for="(value, name) in row" :key="name">
            <td v-if="!columnsToHide.includes(name)">
                {{ value }}
            </td>
        </template>
        <TableRowActionCell 
            v-if="actions" 
            :actions="actions" 
            :itemId="row.id" 
            :actionsAsDropDownList="actionsAsDropDownList"
        />
    </tr>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import TableRowActionCell from "./TableRowActionCell.vue";
    import { Action, ColumnType } from "./types";

    export default defineComponent({
        name: "TableRow",
        components: {
            TableRowActionCell
        },
        props: {
            row: {
                type: Object as PropType<ColumnType>,
                require: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            },
            columnsToHide: {
                type: Object as PropType<Array<{ pos: number }> | undefined>
            },
            actionsAsDropDownList: {
                type: Boolean
            }
        }
    })
</script>