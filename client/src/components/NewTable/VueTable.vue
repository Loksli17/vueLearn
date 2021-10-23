<template>
    <table class="vue-table">
        <thead class="vue-table-header">
            <tr>
                <th v-if="config.selectableRows">
                    <Checkbox v-model="selectAll" />
                </th>
                <TableHeader :columns="columns" />
            </tr>
        </thead>
        <tbody class="vue-table-body">
            <TableRow
                v-for="(row, index) in displayableRows"
                :key="index"
                :row="row"
                :custom-cells="customCells"
                :selectable="config.selectableRows"
                @toggled-selection="toggleSelection"
                 />
        </tbody>
        <tfoot class="vue-table-footer">
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { ComponentPublicInstance, computed, defineComponent, onMounted, PropType, ref } from 'vue';
    import Checkbox from "@/components/crudComponent/VueCheckbox.vue";
    import TableHeader                   from "./VueTableHeader.vue";
    import TableRow                      from "./VueTableRow.vue";
    import { Column,TableColumnHandlers, TableConfig, SortOrder } from "./types";

    type Row = Record<string, unknown>;

    export default defineComponent({

        components: {
            TableHeader,
            TableRow,
            Checkbox
        },

        props: {
            rowData: {
                type: Object as PropType<Array<Row>>,
                required: true
            },
            columns: {
                type: Object as PropType<Array<Column>>,
                required: true
            },
            selectedRows: {
                type: Object as PropType<Array<Row>>,
                default: () => ({})
            },
            columnHandlers: {
                type: Object as PropType<Array<TableColumnHandlers>>
            },
            config: {
                type: Object as PropType<TableConfig>,
                default: () => ({
                    sortable:       false,
                    columnsToHide:  [],
                    selectableRows: false                    
                })
            }
        },

        setup(props, { emit }) {
            const 
                selectedField = ref(""),
                sortOrder     = ref(SortOrder.ASCENDING),
                selectAll     = ref(false);

            onMounted(() => {
                selectedField.value = props.columns[0].fieldName;
            });

            const computedSelected = computed({
                get(): Array<Row> {
                    return props.selectedRows;
                },
                set(newVal: Array<Row>) {
                    emit("update:modelSelectedRows", newVal);
                }
            })

            const rowsWithOnlyRequiredFields = computed(() => {
                const arr: Array<Row> = [];

                for (const row of props.rowData) 
                {
                    const rowWithRequiredFields = {} as typeof row;

                    for (const col of props.columns) 
                    {
                        const fieldName: keyof typeof row = col.fieldName;

                        if (!(fieldName in row)) continue;

                        rowWithRequiredFields[fieldName] = row[fieldName];
                    }

                    arr.push(rowWithRequiredFields);
                }

                return arr;
            });

            const sortedRows = computed(() => {
                let arr: Array<Row> = [];

                if (props.config.sortable)
                {
                    const comparator = (row1: Row, row2: Row): number => {
                        const fieldName = props.columns.find(col => col.fieldName === selectedField.value)?.fieldName;
                        let res = 0;

                        if (fieldName) 
                        {
                            const
                                val1 = row1[fieldName],
                                val2 = row2[fieldName],
                                columnHandler = props.columnHandlers?.find(comp => 
                                    comp.fieldName === fieldName);

                            if (columnHandler && columnHandler.columnComparator) 
                            {
                                return columnHandler.columnComparator(val1, val2);
                            }

                            // default behavior

                            const
                                val1String = Object.prototype.toString.call(val1).toLowerCase(),
                                val2String = Object.prototype.toString.call(val2).toLowerCase();


                            if (val1String < val2String) res = -1;
                            if (val1String > val2String) res = 1;

                        }
                        return res * sortOrder.value;
                    }

                    arr = rowsWithOnlyRequiredFields.value.slice().sort(comparator);
                }
                else
                {
                    arr = rowsWithOnlyRequiredFields.value;
                }

                return arr;
            });

            const displayableRows = computed(() => {
                const arr: Array<Row> = [];

                for (const row of sortedRows.value) 
                {
                    const newRow = {} as typeof row;

                    for (const col of props.columns) 
                    {
                        const fieldName = col.fieldName;

                        const columnHandler = props.columnHandlers?.find(handler =>
                            handler.fieldName === fieldName);

                        if (columnHandler && columnHandler.columnHandler) 
                        {
                            newRow[fieldName] = columnHandler.columnHandler(row[fieldName]);
                        } 
                        else 
                        {
                            newRow[fieldName] = row[fieldName];
                        }
                    }
                    arr.push(newRow);
                }

                return arr;
            });

            const customCells = computed(() => {
                let arr: Array<{ 
                    fieldName: string, 
                    component: ComponentPublicInstance
                    fieldToGetDataFrom?: string }> = [];

                for (const col of props.columns) 
                {
                    if (col.customCell) 
                    {
                        arr.push({
                            fieldName: col.fieldName,
                            component: col.customCell.cellComponent,
                            fieldToGetDataFrom: col.customCell.fieldToGetDataFrom
                        });
                    }
                }

                return arr;
            });

            const toggleSelection = (val: {isSelected: boolean, row: Row}) => {
                // console.log(val);
                if (val.isSelected) {
                    computedSelected.value.push(val.row);
                } else {
                    computedSelected.value = computedSelected.value.filter(row => row != val.row);
                }
            } 

            return {
                displayableRows,
                customCells,
                selectAll,
                toggleSelection
            }
        },
    })
</script>

<style lang="scss">
    .vue-table {
        border-collapse: collapse;

        td, th {
            padding: 10px;
        }

        .vue-table-header {
            background-color: cadetblue;
            color: white;
        }
    }
</style>
