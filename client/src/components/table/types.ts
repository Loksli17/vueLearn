export interface Column {
    name: string;
}

export interface Action {
    name: string;
    path?: (id: number | string) => string;
    handler?: (arg: any) => void;
}

export type columnType = string | number | boolean | Date | Action | Array<Action>;