import CryptoJS from "crypto-js";


export default {

    createFileName: (filename: string): string => {
        
        let 
            regType: RegExp                  = /\.[A-Za-z]{3,5}/g,
            regRes : RegExpMatchArray | null = filename.match(regType),
            name   : string                  = "",
            type   : string                  = "";

        if(regRes == null) throw new Error('Bad filename');
            
        type = regRes[0];

        name = filename.replace(`${type}`, "");
        name = CryptoJS.SHA224(`${name}`).toString();
        return `${name}${type}`;
    }
}