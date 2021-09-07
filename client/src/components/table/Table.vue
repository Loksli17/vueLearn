<template>
    <table border="1">
        <TableHeader 
            :columnNames="cols" 
            @selected-column="setSelectedColumn"
            :columnId="columnId"
            :sortOrder="sortOrder"
            :table-is-sortable="config.sortableByColumn"
            :has-actions="!!actions" 
        />
        <tbody>
            <TableRow 
                v-for="row in rows" 
                :key="row.id" 
                :row="row" 
                :actions="actions"
            />
        </tbody>
        <tfoot>
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { defineComponent, PropType }                          from 'vue';
    import TableHeader                                            from './TableHeader.vue';
    import TableRow                                               from "./TableRow.vue";
    import { Column, columnType, Action, TableConfig, SortOrder } from "./types";

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
            },
            config: {
                type: Object as PropType<TableConfig>,
                default: () => ({
                    hideColumn:       undefined,
                    sortableByColumn: false,
                    // comparator:       undefined
                })
            }
        },
        data() {
            return {
                columnId: 0 as number,
                sortOrder: SortOrder.ASCENDING as SortOrder,
            }
        },
        computed: {
            rows(): Array<Record<string, columnType>> {
                let arr: Array<Record<string, columnType>> = [];

                if (this.config.sortableByColumn) {
                    const comparator = /*this.config.comparator ?? */((row1: Record<string, columnType>, row2: Record<string, columnType>): number => {
                        const
                            columnName = Object.keys(this.rowData[0])[this.columnId],
                            val1       = row1[columnName].toString().toLowerCase(),
                            val2       = row2[columnName].toString().toLowerCase();

                        let res = 0;
                        if (val1 < val2) {
                            res = -1;
                        } 
                        if (val1 > val2) {
                            res = 1;
                        }

                        return res * this.sortOrder;
                    });

                    arr = this.rowData.slice().sort(comparator);
                } else {
                    arr = this.rowData;
                }
                
                return arr;
            },
            /**
             * Reorders the column names according to the order of the columns in rows
             */
            cols(): Array<Column> {
                // return this.columnNames.filter((col, index) => !this.config.hideColumn?.includes(index));
                const newColumnNames: Array<Column> = [];
                if (this.rowData.length > 0) {
                    for (const fieldName in this.rowData[0]) {
                        const name = this.columnNames.find(name => name.fieldName === fieldName);
                        if (name) newColumnNames.push(name);
                    }

                    for (const name of this.columnNames) {
                        if (!newColumnNames.includes(name)) {
                            newColumnNames.push(name);
                        }
                    }
                } else {
                    newColumnNames.push(...this.columnNames);
                }

                return newColumnNames;
            },
            columnsToBeHidden(): Array<string> {
                const columns: Array<string> = [];
                Object.keys(this.rowData[0]).forEach((val, index) => {
                    if (this.config.hideColumn?.includes(index)) {
                        columns.push(val);
                    }
                });

                return columns;
            }
        },
        methods: {
            setSelectedColumn(id: number): void {
                this.columnId = id;
                this.sortOrder = (this.sortOrder === SortOrder.ASCENDING) ? SortOrder.DESCENDING : SortOrder.ASCENDING;
            }
        }
    });
</script>