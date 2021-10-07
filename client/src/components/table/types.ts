export interface Column {
    fieldName: string;
    displayedName: string;
}

/**
 * Describes a comparator object for the sorting algorithm
 * 
 * This object has two fields: 
 * 1. fieldName, which should have the same value
 * as Column's fieldName;
 * 2. columnComparator, a function that compares the two adjacent values
 */
export interface TableColumnHandler {
    /**
     * Name of the column, has to be the same as Column's fieldName
     */
    fieldName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnComparator?: (val: any, nextVal: any) => 0 | 1 | -1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnHandler?:   (value: any) => string;
}

// export interface CustomCell {
//     fieldName: string;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     component: any;
// }

export interface Action {
    iconPath?: string;
    /** Name of the action, which will be displayed in the table */
    name: string;
    /** If action is a route, it requires a specified path, which must
     * be generated for each row of the table, and must include the id of the row
     */
    path?: (id: number | string) => string;
    /** A handler functon for the action. Will be called upon clicking on the
     * action.
     * 
     * NOTE: Handlers may require to bind their 'this' parameter
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler?: (arg: any) => void;
    cssClassName?: string;
}

/**
 * Table configuration
 */
export interface TableConfig {
    /** If defined, denotes which columns must be hidden */
    columnsToHide?: Array<string>;
    /** If defined sorting of the table be the means of clicking on the column header */
    sortableByColumn?: { default: SortOrder };
    /** Determines how actions are displayer:
     * 
     * true - as dropdown list
     * 
     * false - in a cell
     */
    dropDownActions?: boolean;
    selectableRows?: boolean;
}

export enum SortOrder {
    ASCENDING  =  1,
    DESCENDING = -1
}

// hmm
export type ColumnType = string | number | boolean | Date | Action | Array<Action>;