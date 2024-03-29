<template>
    <table>
        <TableHeader 
            :columnNames="cols" 
            :columnId="columnId"
            :sortOrder="sortOrder"
            :table-is-sortable="(config.sortableByColumn && config.sortableByColumn != {})"
            :has-actions="!!actions" 
            :columns-to-hide="columnNamesToBeHidden"
            :selectable="config.selectableRows ?? false"
            @selected-column="setSelectedColumn"
            @select-all="toggleAllSelection"
        />
        <tbody>
            <TableRow 
                v-for="row in rowsForDisplay" 
                :ref="addToRefArray"
                :key="row.id" 
                :row="row" 
                :actions="actions"
                :columns-to-hide="columnNamesToBeHidden"
                :actions-as-drop-down-list="config.dropDownActions"
                :selectable="config.selectableRows ?? false"
                @is-selected="addToSelection($event, row)"
            />
        </tbody>
        <tfoot>
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { ComponentPublicInstance, defineComponent, PropType }                        from 'vue';
    import TableHeader                                                                   from './TableHeader.vue';
    import TableRow                                                                      from "./TableRow.vue";
    import { Column, ColumnType, Action, TableConfig, SortOrder, TableColumnHandler } from "./types";

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
            columnHandlers: {
                type: Object as PropType<Array<TableColumnHandler>>
            },
            selectedRows: {
                type: Object as PropType<Array<Record<string, ColumnType>>>
            },
            config: {
                type: Object as PropType<TableConfig>,
                default: () => ({
                    hideColumn:       [],
                    sortableByColumn: false,
                    dropDownActions:  false,
                    selectableRows:   false
                })
            }
        },

        emits: ["update:selected-rows"],

        data() {
            return {
                columnId: 0 as number,
                sortOrder: SortOrder.ASCENDING as SortOrder,
                rowRefs: [] as Array<ComponentPublicInstance<typeof TableRow>>
            }
        },

        beforeUpdate() {
            this.rowRefs = [];
        },

        mounted() {
            if (this.config.sortableByColumn) {
                if (this.config.sortableByColumn)
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

                        // const handler = this.columnHandlers?.find(handler => handler.fieldName === fieldName);
                        newRow[fieldName] = row[fieldName];
                        // newRow[fieldName] = (handler && handler.columnHandler) ? handler.columnHandler(row[fieldName]) : row[fieldName];
                    }

                    arr.push(newRow);
                }

                return arr;
            },

            rowsForDisplay(): Array<Record<string, ColumnType>> {
                let arr: Array<Record<string, ColumnType>> = [];

                for (let row of this.rows) {
                    const newRow = {} as typeof row;

                    for (const fieldName in row) {
                        
                        const handler = this.columnHandlers?.find(handler => handler.fieldName === fieldName)?.columnHandler;
                        if (handler) {
                            newRow[fieldName] = handler(row[fieldName]);
                        } else {
                            newRow[fieldName] = row[fieldName]
                        }

                    }

                    arr.push(newRow);
                }

                return arr;
            },

            rows(): Array<Record<string, ColumnType>> {
                let arr: Array<Record<string, ColumnType>> = [];

                if (this.config.sortableByColumn && this.config.sortableByColumn.default) {
                    /* */
                    const comparator = (row1: Record<string, ColumnType>, row2: Record<string, ColumnType>): number => {
                        const
                            fieldName = this.cols[this.columnId].fieldName,
                            val1       = row1[fieldName],
                            val2       = row2[fieldName],
                            comparator = this.columnHandlers?.find(comp => comp.fieldName == fieldName)?.columnComparator;
                        
                        if (comparator) {
                            return comparator(val1, val2) * this.sortOrder;
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

            selectedRowsComputed: {
                get(): Array<Record<string, ColumnType>> {
                    return this.selectedRows ?? [];
                },
                set(newVal: Array<Record<string, ColumnType>>) {
                    this.$emit("update:selected-rows", newVal);
                }
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
            },
            // TODO: make selectAll happen
            addToSelection(isSelected: boolean, row: Record<string, ColumnType>) {
                if (isSelected) {
                    const actualRow = this.rows.find(r => r.id === row.id);

                    if (actualRow)
                        this.selectedRowsComputed.push(actualRow);
                } else {
                    // ! Kostyl, will be changed later
                    const rowToDelete = this.selectedRowsComputed.find(r => r.id === row.id);
                    if (rowToDelete)
                        this.selectedRowsComputed.splice(this.selectedRowsComputed.indexOf(rowToDelete), 1);
                }
            },
            // ! This is not a particualrly good way of doing this,
            // ! but the alternatives would be worse
            // ! It's fine if we keep this internally
            // TODO: Refactor the entire table
            toggleAllSelection(selectAll: boolean) {
                if (selectAll) {
                    this.rowRefs.forEach(rowRef => {
                        rowRef.setSelection(true);
                    })
                } else {
                    this.rowRefs.forEach(rowRef => {
                        rowRef.setSelection(false);
                    })
                }
            },
            addToRefArray(el: ComponentPublicInstance<typeof TableRow>) {
                this.rowRefs.push(el);
            }
        },
    });
</script>


<style lang="scss">

    table, th, td{
        border: 2px solid rgb(190, 184, 184);
    }

    table{
        width: 100%;
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