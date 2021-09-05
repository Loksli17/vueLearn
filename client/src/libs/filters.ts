import moment from 'moment';

export default {
    upperFirst: function(str: string){
        console.log(str);
        return str[0].toUpperCase() + (str.slice(1, (str.length)));
    },
    datetimeToDb: function(date: Date | string){
        return moment(date).format('YYYY-MM-DD hh:mm:ss');
    },
    datetimeToView: function(date: Date | string){
        return moment(date).format('D.MM.YY h:mm a');
    },
    datetimeToViewMessage: function(date: Date | string){
        return moment(date).format('h:mm a D MMMM');
    },
    dateToDb: function(date: Date | string): string{
        return moment(date).format('YYYY-MM-DD');
    },
    dateToView: function(date: Date | string): string{
        return moment(date).format('MMMM Do YYYY');
    },
    timeToDb: function(date: Date | string): string{
        return moment(date).format('hh:mm');
    },
    timeToView: function(date: Date | string): string{
        return moment(date).format('h:mm a');
    }
}