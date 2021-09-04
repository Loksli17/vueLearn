<template>
    <table border="1">
        <TableHeader 
            :columnNames="cols" 
            @selected-column="setSelectedColumn"
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
    import { defineComponent, PropType } from 'vue';
    import TableHeader from './TableHeader.vue';
    import TableRow from "./TableRow.vue";
    import { Column, columnType, Action, TableConfig } from "./types";
   
    enum SortOrder {
        ASCENDING,
        DESCENDING
    }

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
                    hideColumn: undefined,
                    sortableByColumn: false,
                    comparator: undefined
                })
            }
        },
        data() {
            return {
                columnId: 0 as number,
                sortOrder: SortOrder.ASCENDING as SortOrder
            }
        },
        computed: {
            rows(): Array<Record<string, columnType>> {
                let arr = [];

                if (this.config.sortableByColumn) {
                    const comparator = this.config.comparator ?? ((row1: Record<string, columnType>, row2: Record<string, columnType>): number => {
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

                        return (this.sortOrder === SortOrder.ASCENDING) ? res : res * -1;
                    })

                    arr = this.rowData.slice().sort(comparator);
                } else {
                    arr = this.rowData;
                }

                // if (this.config.hideColumn) {
                //     arr.forEach(row => {
                //         // if (!this.columnsToBeHidden) return row;
                //         for (const col of this.columnsToBeHidden) {
                //             delete row[col];
                //         }
                //     })
                // }
                
                return arr;
            },
            cols(): Array<Column> {
                return this.columnNames.filter((col, index) => !this.config.hideColumn?.includes(index));
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
    })
</script>