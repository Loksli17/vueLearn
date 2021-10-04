export interface LoadingFile{
    file      : File;
    index     : number;
    progress  : number;
    image     : string;
    shortName : string;
    normalType: string;
    icon?     : string;
}

export interface TypeIcon{
    [index: string]: string;
}