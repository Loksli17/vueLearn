import { TypeIcons } from "./types";

const typeIcons: TypeIcons = {
    '.pdf' : 'pdf.png',
    '.docx': 'word.svg',
    '.doc' : 'word.svg',
    '.pptx': 'power-point.svg',
    '.xlsx': 'excel.svg',
    '.txt' : 'notebook.png',
    '.avi' : 'avi.png',
    '.gif' : 'gif.png',
    '.vsdx': 'visio.svg',
}

enum ProgressBar {
    Different = 'different',
    Overall   = 'overall',
}

const normalFileSize = (size: number): string => {

    let
        count   : number    = 0,
        dataType: string = '';

    while(size >= 1024){
        count++;
        size /= 1024;
        size = +size.toFixed(3);
    }

    switch(count){
        case 0:
            dataType = 'b';
            break;
        case 1:
            dataType = 'kb';
            break;
        case 2:
            dataType = 'mb';
            break;
        case 3:
            dataType = 'gb';
            break;
    }

    return `${size} ${dataType}`;
}

const readFile = (file: File): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();

        reader.onload = () => {
            resolve(reader.result || '');
        }

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


const getTypeFromFile = (file: File) => {

    let   regResult : RegExpMatchArray | null = [];
    const regExpType: RegExp                  = /\.[a-zA-Z0-9]+$/gi;

    regResult = file.name.match(regExpType);

    if(regResult == null){
        throw new Error('bad type of file');
    }

    return regResult[0];
}


export { 
    typeIcons,
    ProgressBar,
    normalFileSize,
    readFile,
    getTypeFromFile,
}