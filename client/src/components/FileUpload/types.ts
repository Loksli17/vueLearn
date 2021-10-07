export interface AddingFile{
    file     : File;
    static?  : boolean;
    progress?: number;
}

export interface LoadingFile extends AddingFile{
    index     : number;
    image     : string;
    shortName : string;
    normalType: string;
    icon?     : string;
}


export interface TypeIcons{
    [index: string]: string;
}