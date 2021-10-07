export interface AddFile{
    file     : File;
    static?  : boolean;
    progress?: number;
}

export enum AddStatus{
    Before = "before",
    After  = "after",
}

export interface LoadingFile extends AddFile{
    index     : number;
    image     : string;
    shortName : string;
    normalType: string;
    icon?     : string;
    addStatus : AddStatus;
}


export interface TypeIcons{
    [index: string]: string;
}