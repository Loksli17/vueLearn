import { AxiosResponse } from 'axios';
import { flashMessage }  from '@smartweb/vue-flash-message';


class DecoratorFactory { 

    public static createDecoratorAfter(handler: (data: any) => any){

        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                const data = await method.apply(this, args);
                return handler(data);
            }

            return descriptor;
        }
    }


    public static createDecoratorBefore(handler: () => void){

        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                handler();
                const data = await method.apply(this, args);
                return data;
            }

            return descriptor;
        }
    }
}



export default abstract class Service{
    
    public static createDecoratorBefore(handler: () => void){
        return DecoratorFactory.createDecoratorBefore(handler);
    }

    public static createDecoratorAfter(handler: (data: any) => any){
        return DecoratorFactory.createDecoratorAfter(handler);
    }

    protected static checkResponse(response: AxiosResponse, statusList: Array<number>, textError: string = "Query returned bad status"){

        if(!statusList.includes(response.status)){
            flashMessage.show({
                blockClass: 'error',
                image     : require("@/assets/img/flash/error.svg"),
                title     : 'Server Error',
                text      : textError,
            });
        }
    }
}