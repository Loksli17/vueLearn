<template>
    <thead class="table-header">
        <th v-if="selectable">
            <Checkbox v-model="selectAll" />
        </th>
        <template v-for="(column, index) in columnNames" 
                :key="index"
            >
            <th 
                @click="emitSelectedColumn(index)"
                class="table-header-column-names"
                :class="{ 'clickable': (tableIsSortable && index !== columnNames.length - 1) }"
                v-if="!columnsToHide.includes(column.fieldName)"
                >
                {{ column.displayedName }}
                <span v-show="index === columnId"
                    v-if="tableIsSortable"
                    :class="[
                        { 'arrow': sortOrder !== undefined },
                        { 'down': (sortOrder === 1) },
                        { 'up': (sortOrder === -1) }
                    ]">
                </span>
            </th>
        </template>
    </thead>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Column } from "./types";
    import Checkbox             from "@/components/crudComponent/VueCheckbox.vue";

    export default defineComponent({
        name: "TableHeader",
        components: {
            Checkbox
        },
        emits: ["selected-column", "select-all"],
        props: {
            columnNames: {
                type: Object as PropType<Array<Column>>,
                required: true
            },
            tableIsSortable: {
                type: Boolean,
                default: false
            },
            hasActions: {
                type: Boolean,
                default: false
            },
            columnId: {
                type: Number,
                required: true
            },
            sortOrder: {
                type: Number,
            },
            selectable: {
                type: Boolean,
                required: true
            },
            columnsToHide: {
                type: Object as PropType<Array<number>>
            }
        },

        data() {
            return {
                selectAll: false as boolean
            }
        },

        watch: {
            selectAll: function() {
                this.$emit("select-all", this.selectAll);
            }
        },

        methods: {
            emitSelectedColumn(id: number): void {
                if (this.hasActions && id === this.columnNames.length - 1) return;
                this.$emit("selected-column", id);
            }
        }
    })
</script>


<style lang="scss" scoped>
    .table-header {
        .table-header-column-names {
            user-select: none;
        }

        .clickable {
            cursor: pointer;
            &:hover {
                background-color: #ccc;
            }
        }

        .arrow {
            border: solid black;
            border-width: 0 3px 3px 0;
            display: inline-block;
            padding: 3px;
        }
        .up {
            transform: rotate(-135deg);
        }

        .down{
            transform: rotate(45deg);
        }
    }
</style>