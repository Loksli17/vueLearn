
import { ListItem }    from "../dropDown/types";
import { LoadingFile } from "../FileUpload/types";


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
    options?: Array<ListItem>; //!! bad
    currentItem?: string | number | ListItem;

    //textarea
    cols?: number;
    maxLenth?: number;
    rows?: number;
    tabindex?: number;
    wrap?: string;

    //file
    maxFilesAmount?: number,
    autoLoad?      : boolean,
    maxFileSize?   : number,
    types?         : Array<string>,
    files?         : Array<File>, //!! bad
    loadHandler?   : (files: LoadingFile[]) => Promise<void> | void, //?????
    fileSizeError? : (file: LoadingFile, msg: string) => void, //?????
    fileTypeError? : (file: LoadingFile, msg: string) => void, //?????
    dragAndDropCapableError?: (msg: string) => void, //?????
    
}


export interface FormDataView{
    [index: string]: Array<Record<string, unknown>> | string | Date | number | boolean;
}

export interface FormErrors{
    [index: string]: string,
}