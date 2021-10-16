import { ComponentPublicInstance } from "vue";

interface TableConfig {
    sortable:       boolean | { default: SortOrder };
    columnsToHide:  Array<Column>;
    selectableRows: boolean;
}

interface Column {
    fieldName:     string;
    displayedName: string;
    customCell?:   {
        cellComponent:       ComponentPublicInstance,
        fieldToGetDataFrom?: string;
    };
}

interface TableColumnHandlers {
    fieldName: string;
    columnComparator?: (val: unknown, nextVal: unknown) => 0 | 1 | -1;
    columnHandler?:    (val: unknown) => string;
}

enum SortOrder {
    ASCENDING  =  1,
    DESCENDING = -1
}

export {
    TableColumnHandlers,
    TableConfig,
    Column,
    SortOrder
}