
interface returnData{
    blockClass: string;
    image: string;
    text: string; 
    title: string;
}

export default {
    
    errorMessage: (title: string, text: string): returnData => {

        return {
            blockClass: 'error',
            image     : require("@/assets/img/flash/error.svg"),
            text      : title,
            title     : text,
        }
    },


    successMessage: (title: string, text: string): returnData => {

        return {
            blockClass: 'success',
            image     : require("@/assets/img/flash/success.svg"),
            text      : title,
            title     : text,
        }
    },


    infoMessage: (title: string, text: string): returnData => {

        return {
            blockClass: 'info',
            image     : require("@/assets/img/flash/info.svg"),
            text      : title,
            title     : text,
        }
    },


    warningMessage: (title: string, text: string): returnData => {

        return {
            blockClass: 'warning',
            image     : require("@/assets/img/flash/warning.svg"),
            text      : title,
            title     : text,
        }
    },
};