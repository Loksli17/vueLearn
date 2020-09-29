const modelMysql = require('../lib/mysqlOrm');

function EventModel() {
    tableName = 'event';
    modelMysql.call(this, tableName);
}

EventModel.prototype = Object.create(modelMysql.prototype);
EventModel.prototype.constructor = EventModel;


EventModel.prototype.rules = {
    integer : ['typeId', 'isReady'],
    string  : ['description', 'title', 'shortDescription'],
    max     : [{ title: 255 }],
    date    : ['dateStart', 'dateEnd'],
    html    : ['description'],
    required: ['title', 'dateStart', 'dateEnd', 'shortDescription'],
    unique  : ['title'],
}


EventModel.prototype.rulesMessages = {
    string  : 'Поле должно быть строкой',
    integer : 'Поле должно быть числом',
    required: 'Данное поле является обязательным',
    max     : 'Значение данного поля больше максимально допустимого',
    date    : 'Дата должна быть формата ГГГГ:ММ:ДД',
    unique  : 'Запись с таким значением уже существует',
}


EventModel.prototype.fields = {
    id              : 'ID',
    title           : 'Название',
    dateStart       : 'Дата начала ',
    dateEnd         : 'Дата конца',
    description     : 'Описание',
    typeId          : 'Тип события',
    shortDescription: 'Краткое описание',
    isReady         : 'Готовность к публикации',
}


EventModel.prototype.validateMessege = 'Ошибка отправки формы';


module.exports = EventModel;
