<template>
    <table>
        <TableHeader 
            :columnNames="cols" 
            @selected-column="setSelectedColumn"
            :columnId="columnId"
            :sortOrder="sortOrder"
            :table-is-sortable="(config.sortableByColumn !== undefined)"
            :has-actions="!!actions" 
            :columnsToHide="columnNamesToBeHidden"
        />
        <tbody>
            <TableRow 
                v-for="row in rows" 
                :key="row.id" 
                :row="row" 
                :actions="actions"
                :columnsToHide="columnNamesToBeHidden"
                :actionsAsDropDownList="config.dropDownActions"
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
    import { Column, ColumnType, Action, TableConfig, SortOrder, TableColumnComparator } from "./types";

    // export { Column, CustomCell, Action, TableConfig, SortOrder, ColumnType }

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
                type: Object as PropType<Array<Record<string, ColumnType>>>,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            },
            comparators: {
                type: Object as PropType<Array<TableColumnComparator>>
            },
            config: {
                type: Object as PropType<TableConfig>,
                default: () => ({
                    hideColumn:       [],
                    sortableByColumn: false,
                    dropDownActions:  false
                })
            }
        },

        data() {
            return {
                columnId: 0 as number,
                sortOrder: SortOrder.ASCENDING as SortOrder,
            }
        },

        mounted() {
            if (this.config.sortableByColumn) {
                this.setSortOrder(this.config.sortableByColumn.default);
            }
        },

        computed: {
            reorderedRows(): Array<Record<string, ColumnType>> {
                let arr: Array<Record<string, ColumnType>> = [];

                for (const row of this.rowData) {
                    const newRow = {} as typeof row;
                    for (const col of this.cols) {
                        const fieldName: keyof typeof row = col.fieldName;
                        if (!(fieldName in row)) continue;

                        newRow[fieldName] = col.columnHandler ? col.columnHandler(row[fieldName]) : row[fieldName];
                    }

                    arr.push(newRow);
                }

                return arr;
            },

            rows(): Array<Record<string, ColumnType>> {
                let arr: Array<Record<string, ColumnType>> = [];

                if (this.config.sortableByColumn) {
                    /* */
                    const comparator = (row1: Record<string, ColumnType>, row2: Record<string, ColumnType>): number => {
                        const
                            columnName = this.cols[this.columnId].fieldName,
                            val1       = row1[columnName],
                            val2       = row2[columnName],
                            comparator = this.comparators?.find(comp => comp.fieldName == columnName);
                        
                        if (comparator) {
                            return comparator.columnComparator(val1, val2) * this.sortOrder;
                        }

                        // default behavior
                        const
                            val1String = val1.toString().toLowerCase(),
                            val2String = val2.toString().toLowerCase();

                        let res = 0;
                        if (val1String < val2String) {
                            res = -1;
                        } 
                        if (val1String > val2String) {
                            res = 1;
                        }

                        return res * this.sortOrder;
                    };

                    arr = this.reorderedRows.slice().sort(comparator);
                } else {
                    arr = this.reorderedRows;
                }
                
                return arr;
            },

            cols(): Array<Column> {
                return this.columnNames;
            },
            
            columnNamesToBeHidden(): Array<string> {
                const columns: Array<string> = [];

                if (this.config.columnsToHide) {
                    for (const col of this.cols) {
                        if (this.config.columnsToHide.includes(col.fieldName)) {
                            columns.push(col.fieldName);
                        }
                    }
                }

                return columns;
            },
        },

        methods: {
            setSortOrder(order: SortOrder): void {
                this.sortOrder = order;
            },
            setSelectedColumn(id: number): void {
                this.columnId = id;
                this.sortOrder = (this.sortOrder === SortOrder.ASCENDING) ? SortOrder.DESCENDING : SortOrder.ASCENDING;
            }
        },
    });
</script>


<style lang="scss">

    table, th, td{
        border: 2px solid rgb(190, 184, 184);
    }

    table{
        width: 1200px;
        margin: 20px 0px;
        border-collapse: collapse;

        th{
            background: #d6fff3;
            font-size: 20px;
            padding: 10px;
        }

        tr{
            &:nth-child(even){
                background: aliceblue;
            }
        }

        td{
            font-size: 18px;
            padding: 10px;
        }

        /* it can be baaaad */
        tfoot > div{
            padding: 10px;
            font-size: 20px;
        }
        
    }
</style>