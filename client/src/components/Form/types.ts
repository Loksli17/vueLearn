import { ListItem } from "../dropDown/types";

export interface FormHtmlItem{
    type: string;
    name: string;
    error?: string;

    //input
    max?: number;
    min?: number;
    label?: string;
    placeholder?: string | number | Date;
    required?: boolean;
    step?: number | string;
    disabled?: boolean;
    pattern?: RegExp;
    autofocus?: boolean;
    autocomplete?: boolean;

    //select
    selected?: string | number;
    multiple?: boolean;
    search?: boolean;
    disabledOption?: string;
    options?: Array<ListItem>;
    currentItem?: string | number | ListItem;

    //textarea
    cols?: number;
    maxLenth?: number;
    rows?: number;
    tabindex?: number;
    wrap?: string;
}


export interface FormDataView{
    [index: string]: Array<Record<string, unknown>> | string | Date | number | boolean;
}

export interface FormErrors{
    [index: string]: string,
}