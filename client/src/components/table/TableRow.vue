<template>
    <tr>
        <td v-if="selectable">
            <Checkbox v-model="isSelected" />
        </td>
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
    import Checkbox             from "@/components/crudComponent/VueCheckbox.vue";

    export default defineComponent({
        name: "TableRow",
        components: {
            TableRowActionCell,
            Checkbox
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
            selectable: {
                type: Boolean,
                required: true
            },
            actionsAsDropDownList: {
                type: Boolean
            }
        },
        data() {
            return {
                isSelected: false as boolean
            }
        },

        emits: ["is-selected"],

        watch: {
            isSelected() {
                this.emitSelected();
            }
        },

        methods: {
            setSelection(val: boolean): void {
                this.isSelected = val;
            },
            emitSelected(): void {
                this.$emit("is-selected", this.isSelected);
            }
        }
    })
</script>