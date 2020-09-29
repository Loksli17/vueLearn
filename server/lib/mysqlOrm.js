const mysql = require('./database');

function modelMysql(_tableName) {
    this.tableName = _tableName;
    this.tagWhiteList = ['strong', 'i', 'u', 'ol', 'ul', 'li', 'a', 'p', 'br', 'h1', 'em', 'i'];
};

//@return NEW STRING without dangerous symbols
modelMysql.prototype.escape = function (object) {
    if (typeof object == 'string') {
        let str = '';
        for (let i = 0; i < object.length; i++) {
            if (
                object[i] != '"' &&
                object[i] != "'" &&
                object[i] != "\x00" &&
                object[i] != "\n" &&
                object[i] != "\r" &&
                object[i] != "\x1a"
            ) {
                str += object[i];
            } else {
                switch (object[i]) {
                    case '"':
                        str += '&#34;';
                        break;
                    case "'":
                        str += '&#39;';
                        break;
                    case "\n":
                        str += '<br>';
                        break;
                }
            }
        }
        return str;
    }
    return object;
}


modelMysql.prototype.escapeTag = function (object) {
    if (typeof object == 'string') {
        let
            str = '',
            tagFlag = false,
            allowFlag = true;

        for (let i = 0; i < object.length; i++) {
            if (object[i] == '<') {

                tagFlag = true;

                let
                    str = '',
                    spaceFlag = false;
                ind = i + 1;

                while (object[ind] != '>') {
                    if (object[ind] == ' ') spaceFlag = true;
                    if (object[ind] != '/' && !spaceFlag) {
                        str += object[ind];
                    }
                    ind++;
                }

                allowFlag = this.tagWhiteList.includes(str);
            }

            if (tagFlag && allowFlag) {
                str += object[i];
            } else if (tagFlag && !allowFlag) {
                if (object[i] == '<') {
                    str += '&lt;';
                } else if (object[i] == '>') {
                    str += '&gt;';
                } else {
                    str += object[i];
                }
            } else if (!tagFlag) {
                str += object[i];
            }

            if (i == '>') {
                tagFlag = false;
            }

        }

        return str;
    } else {
        return object;
    }
}


modelMysql.prototype.escapeTagFull = function (object) {
    if (typeof object == 'string') {
        let str = '';
        for (let i = 0; i < object.length; i++) {
            if (object[i] == '<') {
                str += '&lt;';
            } else if (object[i] == '>') {
                str += '&gt;';
            } else {
                str += object[i];
            }
        }
        return str;
    }
    return object;
}


//@return EXEPTION if data in rules are uncorrect
modelMysql.prototype.checkTypeRules = function () {
    let
        permissionFields = ['integer', 'json', 'boolean', 'string', 'date', 'email', 'phone'],
        flFirst = false,
        flSecond = false,
        keyFirst = '',
        keySecond = '';

    for (let keyFirstRule in this.rules) {
        flFirst = false;
        for (let i = 0; i < permissionFields.length; i++) {
            if (permissionFields[i] == keyFirstRule) flFirst = true;
        }
        if (!flFirst) continue;

        for (let keySecondRule in this.rules) {
            flSecond = false;
            for (let i = 0; i < permissionFields.length; i++) {
                if (permissionFields[i] == keySecondRule && keySecondRule != keyFirstRule) flSecond = true;
            }
            if (!flSecond) continue;

            //проверка
            for (let keyRuleFirR in this.rules[keyFirstRule]) {
                for (let keyRuleSecR in this.rules[keySecondRule]) {
                    if (this.rules[keyFirstRule][keyRuleFirR] == this.rules[keySecondRule][keyRuleSecR]) {
                        throw "Field `" + this.rules[keyFirstRule][keyRuleFirR] + "` is used in " + keyFirstRule + " and " + keySecondRule + ". Please, correct rules of your model.";
                        return;
                    }
                }
            }
        }
    }
}


//@return TRUE or FALSE of validation
modelMysql.prototype.validate = async function (object) {
    if (this.rules != undefined) {

        let
            errors = {
                required: [],
                string: [],
                integer: [],
                json: [],
                max: [],
                min: [],
                boolean: [],
                unique: [],
                date: [],
                datetime: [],
                time: [],
                email: [],
                phone: [],
            },
            errorsFields = {},
            countObject = 0;

        //countObject
        for (let key in object) {
            countObject++;
        }

        let flag = 0;

        if (this.rules.required != undefined) {
            let required = this.rules.required;
            for (let i = 0; i < required.length; i++) {
                flag = 0;
                for (let key in object) {
                    if (required[i] == key && object[key] != undefined && object[key] != '') {
                        break;
                    } else {
                        flag++;
                    }
                }
                if (flag == countObject) {
                    errors.required.push(required[i]);
                }
            }
        }

        if (this.rules.string != undefined) {
            let str = this.rules.string;
            for (let i in str) {
                for (let key in object) {
                    if (object[key] != null) {
                        if (str[i] == key && typeof object[key] != 'string') {
                            errors.string.push(key);
                        }
                    }
                }
            }
        }

        if (this.rules.integer != undefined) {
            let int = this.rules.integer;
            for (let i in int) {
                for (let key in object) {
                    if (object[key] != null) {
                        if (int[i] == key && typeof object[key] != 'number') {
                            if (isNaN(Number(object[key]))) {
                                errors.integer.push(key);
                            }
                        }
                    }
                }
            }
        }

        if (this.rules.json != undefined) {
            let json = this.rules.json;
            for (let i in json) {
                for (let key in object) {
                    if (json[i] == key && typeof object[key] != 'object') {
                        errors.json.push(json[i]);
                    }
                }
            }
        }

        if (this.rules.boolean != undefined) {
            let boolean = this.rules.boolean;
            for (let i in boolean) {
                for (let key in object) {
                    if (key == boolean[i]) {
                        if (typeof object[key] != "boolean") {
                            if ((typeof object[key] == 'number' && object[key] != 0 && object[key] != 1) || typeof object[key] != 'number') {
                                errors.boolean.push(key)
                            }
                        }
                    }
                }
            }
        }

        if (this.rules.max != undefined) {
            for (let i = 0; i < this.rules.max.length; i++) {
                for (let key in object) {
                    let opt = Object.keys(this.rules.max[i])[0];
                    if (key == opt) {
                        if (object[key] != null) {
                            switch (typeof object[key]) {
                                case 'number':
                                    if (object[key] > this.rules.max[i][opt] && object[key] != null) {
                                        errors.max.push(opt);
                                    }
                                    break;
                                case 'string':
                                    if (object[key].length > this.rules.max[i][opt] && object[key] != null) {
                                        errors.max.push(opt);
                                    }
                                    break;
                                default:
                                    throw "Field `" + Object.keys(this.rules.max[i])[0] + "` in max must have integer or string type. Please, correct rules of your model.";
                                    return;
                            }
                        }
                    }
                }
            }
        }

        if (this.rules.min != undefined) {
            for (let i = 0; i < this.rules.min.length; i++) {
                for (let key in object) {
                    let opt = Object.keys(this.rules.min[i])[0];
                    if (key == opt) {
                        if (object[key] != null) {
                            switch (typeof object[key]) {
                                case 'number':
                                    if (object[key] < this.rules.min[i][opt]) {
                                        errors.min.push(opt);
                                    }
                                    break;
                                case 'string':
                                    if (object[key].length < this.rules.min[i][opt]) {
                                        errors.min.push(opt);
                                    }
                                    break;
                                default:
                                    throw "Field `" + Object.keys(this.rules.min[i])[0] + "` in max must have integer or string type. Please, correct rules of your model.";
                                    return;
                            }
                        }
                    }
                }
            }
        }

        if (this.rules.unique != undefined) {
            let
                condition = "",
                query = "",
                fields = "id, ",
                result = [];

            for (let i = 0; i < this.rules.unique.length; i++) {
                condition += this.rules.unique[i] + " = '" + object[this.rules.unique[i]] + "'";
                fields += this.rules.unique[i];
                if (i != this.rules.unique.length - 1) {
                    condition += " OR ";
                    fields += ", ";
                }
            }

            query += 'SELECT ' + fields + ' FROM ' + this.tableName + ' WHERE ' + condition;

            result = await mysql.promise().query(query);
            result = result[0][0];

            if (result != undefined) {
                for (let keyRes in result) {
                    for (let keyObj in object)
                        if (result[keyRes] == object[keyObj] && object.id != result.id) {
                            errors.unique.push(keyObj);
                        }
                }
            }
        }

        if (this.rules.date != undefined) {
            for (let i = 0; i < this.rules.date.length; i++) {
                for (let key in object) {
                    if (key == this.rules.date[i]) {
                        let date = new Date(object[key]);
                        if (object[key][4] != '-' ||
                            object[key][7] != '-' ||
                            Object.prototype.toString.call(date) != '[object Date]' ||
                            isNaN(date.getTime())
                        ) {
                            errors.date.push(key);
                        }
                    }
                }
            }
        }

        if (this.rules.time != undefined) {
            for (let i = 0; i < this.rules.time.length; i++) {
                for (let key in object) {
                    if (key == this.rules.time[i]) {
                        let time = new Date(`1970-01-01T${object[key]}`);
                        if (object[key][2] != ':' ||
                            object[key][5] != ':' ||
                            Object.prototype.toString.call(time) != '[object Date]' ||
                            isNaN(time.getTime())
                        ) {
                            errors.time.push(key);
                        }
                    }
                }
            }
        }

        if (this.rules.datetime != undefined) {
            for (let i = 0; i < this.rules.date.length; i++) {
                for (let key in object) {
                    if (key == this.rules.datetime[i]) {
                        let datetime = new Date(object[key]);
                        if (object[key][4] != '-' ||
                            object[key][7] != '-' ||
                            object[key][13] != ':' ||
                            object[key][16] != ':' ||
                            Object.prototype.toString.call(datetime) != '[object Date]' ||
                            isNaN(datetime.getTime())
                        ) {
                            errors.datetime.push(key);
                        }
                    }
                }
            }
        }

        if (this.rules.email != undefined) {
            for (let i = 0; i < this.rules.email.length; i++) {
                for (let key in object) {
                    if (key == this.rules.email[i]) {
                        object[key] = String(object[key]);
                        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                        if (!reg.test(String(object[key]).toLowerCase())) {
                            errors.email.push(key);
                        }
                    }
                }
            }
        }

        if (this.rules.phone != undefined) {
            for (let i = 0; i < this.rules.phone.length; i++) {
                for (let key in object) {
                    if (key == this.rules.phone[i]) {
                        let reg = /^[\d]{1}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/;
                        if (!reg.test(String(object[key]))) {
                            errors.phone.push(key);
                        }
                    }
                }
            }
        }

        //defence from xss
        for (let key in object) {
            let flag = false;
            if (this.rules.html != undefined) {
                for (let i = 0; i < this.rules.html.length; i++) {
                    if (key == this.rules.html[i]) {
                        flag = true;
                        object[key] = this.escapeTag(object[key]);
                        continue;
                    }
                }
            }
            if (!flag) object[key] = this.escapeTagFull(object[key]);
        }

        //cycle for checking errors and push errors in array. User will get only last error.
        for (let key in object) {
            for (let i = 0; i < errors.string.length; i++) {
                if (key == errors.string[i]) {
                    if (this.rulesMessages.string != undefined) {
                        errorsFields[key] = this.rulesMessages.string;
                    } else {
                        errorsFields[key] = 'This field must be String.';
                    }
                }
            }

            for (let i = 0; i < errors.integer.length; i++) {
                if (key == errors.integer[i]) {
                    if (this.rulesMessages.integer != undefined) {
                        errorsFields[key] = this.rulesMessages.integer;
                    } else {
                        errorsFields[key] = 'This field must be Integer.';
                    }
                }
            }

            for (let i = 0; i < errors.json.length; i++) {
                if (key == errors.json[i]) {
                    if (this.rulesMessages.json != undefined) {
                        errorsFields[key] = this.rulesMessages.json;
                    } else {
                        errorsFields[key] = 'This field must be JSON.';
                    }
                }
            }

            for (let i = 0; i < errors.max.length; i++) {
                if (key == errors.max[i]) {
                    let value = 0;
                    for (let j = 0; j < this.rules.max.length; j++) {
                        if (this.rules.max[j][key] != undefined) {
                            value = this.rules.max[j][key];
                        }
                    }
                    if (this.rulesMessages.max != undefined) {
                        value ? errorsFields[key] = `${this.rulesMessages.max} ${value}` : `${this.rulesMessages.max}`;
                    } else {
                        value ? errorsFields[key] = `This field has value more then value: ${value}` : 'This field has value more then value in rules.max.';
                    }
                }
            }

            for (let i = 0; i < errors.min.length; i++) {
                let value = 0;
                for (let j = 0; j < this.rules.min.length; j++) {
                    if (this.rules.min[j][key] != undefined) {
                        value = this.rules.min[j][key];
                    }
                }
                if (key == errors.min[i]) {
                    if (this.rulesMessages.min != undefined) {
                        value ? errorsFields[key] = `${this.rulesMessages.min} ${value}` : `${this.rulesMessages.min}`;
                    } else {
                        value ? errorsFields[key] = `This field has value less then value: ${value}` : 'This field has value less then value in rules.min';
                    }
                }
            }

            for (let i = 0; i < errors.boolean.length; i++) {
                if (key == errors.boolean[i]) {
                    if (this.rulesMessages.boolean != undefined) {
                        errorsFields[key] = this.rulesMessages.boolean;
                    } else {
                        errorsFields[key] = 'This field must be boolean or has number value from [0, 1].';
                    }
                }
            }

            for (let i = 0; i < errors.unique.length; i++) {
                if (key == errors.unique[i]) {
                    if (this.rulesMessages.unique != undefined) {
                        errorsFields[key] = this.rulesMessages.unique;
                    } else {
                        errorsFields[key] = "This field has unique value. Don't repeat value on this field.";
                    }
                }
            }

            for (let i = 0; i < errors.date.length; i++) {
                if (key == errors.date[i]) {
                    if (this.rulesMessages.date != undefined) {
                        errorsFields[key] = this.rulesMessages.date;
                    } else {
                        errorsFields[key] = "This field must be date. Please, input correct date.";
                    }
                }
            }

            for (let i = 0; i < errors.datetime.length; i++) {
                if (key == errors.datetime[i]) {
                    if (this.rulesMessages.datetime != undefined) {
                        errorsFields[key] = this.rulesMessages.datetime;
                    } else {
                        errorsFields[key] = "This field must be datetime. Please, input correct datetime";
                    }
                }
            }

            for (let i = 0; i < errors.time.length; i++) {
                if (key == errors.time[i]) {
                    if (this.rulesMessages.time != undefined) {
                        errorsFields[key] = this.rulesMessages.time;
                    } else {
                        errorsFields[key] = "This field must be time. Please, input correct time.";
                    }
                }
            }

            for (let i = 0; i < errors.email.length; i++) {
                if (key == errors.email[i]) {
                    if (this.rulesMessages.email != undefined) {
                        errorsFields[key] = this.rulesMessages.email;
                    } else {
                        errorsFields[key] = "Please, input correct email.";
                    }
                }
            }

            for (let i = 0; i < errors.phone.length; i++) {
                if (key == errors.phone[i]) {
                    if (this.rulesMessages.phone != undefined) {
                        errorsFields[key] = this.rulesMessages.phone;
                    } else {
                        errorsFields[key] = "Please, input correct phone.";
                    }
                }
            }
        }

        if (this.rules.required != undefined) {
            for (let i = 0; i < this.rules.required.length; i++) {
                for (let j = 0; j < errors.required.length; j++) {
                    if (this.rules.required[i] == errors.required[j]) {
                        if (this.rulesMessages.required != undefined) {
                            errorsFields[this.rules.required[i]] = this.rulesMessages.required;
                        } else {
                            errorsFields[this.rules.required[i]] = 'This field must be blanked';
                        }
                    }
                }
            }
        }

        for (let key in errors) {
            if (errors[key].length != 0) {
                return errorsFields;
            }
        }
        return true;
    } else {
        return true;
    }
}


modelMysql.prototype.where = (where, subquery) => {
    let
        cond = '',
        mesEr = 'Where must be an array of objects. Please use correct value of Where.',
        equal = (arr, ind, ort, condKey) => {
            if (typeof arr[ind] != 'object' || !arr instanceof Object) { throw 'eq must be object of object' };

            for (let i in arr[ind]) {
                if (typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Object) { throw 'eq must be object of object' };

                for (let j in arr[ind][i]) {
                    if (typeof arr[ind][i][j] == 'object') {
                        for (let key in arr[ind][i][j]) {
                            if (key == 'subquery') {
                                let list = ['ALL', 'SOME', 'ANY'];
                                arr[ind][i][j][key][0] = new modelMysql().escape(arr[ind][i][j][key][0]);
                                if (!list.includes(arr[ind][i][j][key][0])) throw "First value in subquery must be 'ALL', 'SOME' or 'ANY'";
                                cond += ` ${j} ${ort} ${arr[ind][i][j][key][0]} (${arr[ind][i][j][key][1].slice(0, -1)}) `;
                                return;
                            } else if (key != 'column') {
                                throw 'In eq, noteq, less, more column can has object value only with subquery. Example: {eq: {group_id: {subquery: ["ALL", query]}}}.';
                            }
                        }
                    }

                    if (typeof arr[ind][i][j] == 'string') arr[ind][i][j] = new modelMysql().escape(arr[ind][i][j]);

                    if (subquery != undefined && subquery) {
                        if (typeof arr[ind][i][j] == 'object') {
                            for (let key in arr[ind][i][j]) {
                                if (key == 'column') {
                                    cond += ` ${j} ${ort} ${arr[ind][i][j][key]} `;
                                } else if (key != 'subquery') {
                                    throw 'In eq, noteq, less, more column can has object value only with subquery. Example: {eq: {group_id: {subquery: ["ALL", query]}}}.';
                                }
                            }
                        }
                    } else {
                        if (typeof arr[ind][i][j] == 'boolean') {
                            cond += ` ${j} ${ort} ${arr[ind][i][j]} `;
                        } else {
                            cond += ` ${j} ${ort} '${arr[ind][i][j]}' `;
                        }
                    }

                }
                if (condKey != undefined && ind != arr.length - 1) {
                    cond += `${condKey}`;
                }
            }
        },
        like = (arr, ind, ort, condKey) => {
            if (typeof arr[ind] != 'object' || !arr instanceof Object) { throw 'like must be object of object' };

            for (let i in arr[ind]) {
                if (typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Object) { throw 'like must be object of object' };
                for (let j in arr[ind][i]) {
                    if (typeof arr[ind][i][j] == 'string') arr[ind][i][j] = new modelMysql().escape(arr[ind][i][j]);
                    if (ort) {
                        cond += ` ${j} LIKE '${arr[ind][i][j]}' `;
                    } else {
                        cond += ` ${j} not LIKE '${arr[ind][i][j]}' `;
                    }
                }

            }
            if (condKey != undefined && ind != arr.length - 1) {
                cond += `${condKey}`;
            }
        },
        inFunc = (arr, ind, ort, condKey) => {
            if (typeof arr[ind] != 'object' || !arr instanceof Object) { throw 'in must be array of object' };

            for (let i in arr[ind]) {
                if (typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Array) { throw 'in must be array of object' };
                for (let j in arr[ind][i]) {
                    if (typeof arr[ind][i][j] == 'string') arr[ind][i][j] = new modelMysql().escape(arr[ind][i][j]);
                    if (ort) {
                        cond += ` ${j} IN (`;
                    } else {
                        cond += ` ${j} not IN (`;
                    }

                    if (!Array.isArray(arr[ind][i][j]) && typeof arr[ind][i][j] == 'object') {
                        for (let key in arr[ind][i][j]) {
                            if (key == 'subquery') {
                                cond += arr[ind][i][j][key].slice(0, -1);
                            } else {
                                throw 'IN must be an array or object for subquery';
                            }
                        }
                    }

                    for (let k = 0; k < arr[ind][i][j].length; k++) {
                        if (typeof arr[ind][i][j][k] == 'string') arr[ind][i][j][k] = new modelMysql().escape(arr[ind][i][j][k]);
                        cond += `'${arr[ind][i][j][k]}'`;
                        if (arr[ind][i][j].length - 1 != k) {
                            cond += ', ';
                        }
                    }
                    cond += `) `;
                }
            }

            if (condKey != undefined && ind != arr.length - 1) {
                cond += `${condKey}`;
            }
        },
        between = (arr, ind, ort, condKey) => {
            if (typeof arr[ind] != 'object' || !arr instanceof Object) { throw 'eq must be object of object' };
            for (let i in arr[ind]) {
                for (let j in arr[ind][i]) {
                    if (typeof arr[ind][i][j] == 'string') arr[ind][i][j] = new modelMysql().escape(arr[ind][i][j]);
                    if (ort) {
                        cond += ` ${j} BETWEEN '${arr[ind][i][j][0]}' AND '${arr[ind][i][j][1]}' `;
                    } else {
                        cond += ` ${j} not BETWEEN '${arr[ind][i][j][0]}' AND '${arr[ind][i][j][1]}' `;
                    }
                }
            }

            if (condKey != undefined && ind != arr.length - 1) {
                cond += `${condKey}`;
            }
        };

    if (!Array.isArray(where) && typeof where != 'object') {
        throw mesEr
    } else if (typeof where == 'object' && !Array.isArray(where)) {
        where = [where];
    }

    let treeIter = (arr, condKey) => {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] != 'object') throw mesEr

            let
                whereObj = arr[i],
                opts = Object.keys(whereObj);

            switch (opts[0]) {
                case 'and':
                    cond += " (";
                    treeIter(arr[i]['and'], 'AND');
                    cond += ") ";
                    if (condKey != undefined && i != arr.length - 1) {
                        cond += `${condKey}`;
                    }
                    break;
                case 'or':
                    cond += " (";
                    treeIter(arr[i]['or'], 'OR');
                    cond += ") ";
                    if (condKey != undefined && i != arr.length - 1) {
                        cond += `${condKey}`;
                    }
                    break;
                case 'eq':
                    equal(arr, i, '=', condKey);
                    break;
                case 'noteq':
                    equal(arr, i, '!=', condKey);
                    break;
                case 'like':
                    like(arr, i, true, condKey);
                    break;
                case 'notLike':
                    like(arr, i, false, condKey);
                    break;
                case 'between':
                    between(arr, i, true, condKey);
                    break;
                case 'notBetween':
                    between(arr, i, false, condKey);
                    break;
                case 'more':
                    equal(arr, i, '>', condKey);
                    break;
                case 'less':
                    equal(arr, i, '<', condKey);
                    break;
                case 'in':
                    inFunc(arr, i, true, condKey);
                    break;
                case 'notIn':
                    inFunc(arr, i, false, condKey);
                    break;
            }
        }
    }

    treeIter(where);
    return cond ? ` WHERE ${cond}` : ``;
}


modelMysql.prototype.join = (join) => {
    let cond = '';

    if (!Array.isArray(join)) {
        throw 'Error: join must be an array of array';
    }

    if (Array.isArray(join) && typeof join[0] == 'string') {
        join = [join];
    }

    for (let i = 0; i < join.length; i++) {
        if (!Array.isArray(join[i])) {
            throw 'Error: join must be an array of array';
        }
        join[i][0] = new modelMysql().escape(join[i][0]);
        join[i][1] = new modelMysql().escape(join[i][1]);
        join[i][2] = new modelMysql().escape(join[i][2]);
        if (join[i][3] != undefined) {
            join[i][3] = new modelMysql().escape(join[i][3]);
            cond += ` ${join[i][0]} JOIN \`${join[i][1]}\` ${join[i][3]} ON ${join[i][2]}`;
        } else {
            cond += ` ${join[i][0]} JOIN \`${join[i][1]}\` ON ${join[i][2]}`;
        }

    }
    return cond;
}


modelMysql.prototype.find = async function (method, conditions) {

    let
        query = "",
        conditionsQuery = "",
        fields = new Array();

    if (conditions == undefined) {
        conditions = {};
    }

    if (conditions.select != undefined) {
        if (!Array.isArray(conditions.select)) {
            throw "Error: select must be an array";
        }
        for (let i = 0; i < conditions.select.length; i++) {
            switch (typeof conditions.select[i]) {
                case 'string':
                    fields += this.escape(conditions.select[i]);
                    break;
                case 'object':
                    if (conditions.select[i].subquery != undefined) {
                        fields += `( ${conditions.select[i].subquery.slice(0, -1)}) `;
                        if (conditions.select[i].as != undefined) {
                            fields += `AS ${this.escape(conditions.select[i].as)}`;
                        }
                    } else {
                        throw `Item in select can be string, or object for subquery (example: {subquery: subquery, as: 'userGroup'})`;
                    }
                    break;
                default:
                    throw 'kek';
            }
            if (i != conditions.select.length - 1) {
                fields += ', ';
            }
        }
    } else {
        fields = '*';
    }

    //conditions concats to query
    if (conditions.join != undefined) {
        conditionsQuery += this.join(conditions.join);
    }

    if (conditions.where != undefined) {
        conditionsQuery += this.where(conditions.where, conditions.subquery);
    }

    if (conditions.group != undefined) {
        conditions.group = this.escape(conditions.group);
        conditionsQuery += ' GROUP BY ' + conditions.group;
        if (conditions.groupDesc != undefined) {
            conditionsQuery += ` DESC`;
        }
    }

    if (conditions.having != undefined) {
        conditions.having = this.escape(conditions.having);
        conditionsQuery += ` HAVING ${conditions.having}`;
    }

    if (conditions.order != undefined) {
        conditions.order = this.escape(conditions.order);
        conditionsQuery += ` ORDER BY ${conditions.order}`;
        if (conditions.orderDesc != undefined && conditions.orderDesc) {
            conditionsQuery += ` DESC`;
        }
    }

    if (conditions.limit != undefined) {
        if (method != 'one') {
            conditions.limit = this.escape(conditions.limit);
            conditionsQuery += ` LIMIT ${conditions.limit}`;
        }
    }

    if (conditions.union != undefined) {
        conditions.union = this.escape(conditions.union);
        conditions.union = conditions.union.slice(0, -1);
        conditionsQuery += ` UNION ${conditions.union}`;
    }

    switch (method) {
        case 'all':
            query = `SELECT ${fields} from \`${this.tableName}\` ${conditionsQuery};`;
            break;
        case 'one':
            query = `SELECT ${fields} from \`${this.tableName}\` ${conditionsQuery} LIMIT 1;`;
            break;
        default:
            throw "Error: method must be 'all' or 'one'";
            return;
    }

    if (conditions.sql != undefined && conditions.sql) {
        return query;
    }

    if (conditions.subquery != undefined && conditions.subquery) {
        return query;
    }

    var result = await mysql.promise().query(query);

    switch (method) {
        case 'all':
            result = result[0];
            break;
        case 'one':
            result = result[0][0];
            break;
    }

    return result;
}


//@return OBJECT
modelMysql.prototype.findById = async function (id, sql) {
    let
        query = "",
        result;

    if (id == undefined) {
        throw 'Error: param id was undefined';
        return false;
    }

    id = Number(id);
    if (isNaN(id)) {
        throw 'Error: param id must be a number';
        return false;
    }

    query = `SELECT * FROM \`${this.tableName}\` WHERE id = ${id}; `;

    if (sql != undefined && sql) {
        return query;
    }

    result = await mysql.promise().query(query);
    result = result[0][0];
    return result;
}


modelMysql.prototype.count = async function (column, conditions) {
    let
        query = '',
        join = '',
        where = '';

    if (conditions == undefined) {
        conditions = {};
    }

    if (conditions.join != undefined) {
        join = this.join(conditions.join);
    }

    if (conditions.where != undefined) {
        where = this.where(conditions.where, conditions.subquery);
    }

    column = this.escape(column);

    if (typeof column == 'string') {
        query = `SELECT COUNT(${column}) FROM ${this.tableName} ${join} ${where} `;
    } else if (Array.isArray(column)) {
        query = `SELECT COUNT(${column[0]}) AS ${column[1]} FROM ${this.tableName} ${join} ${where}`;
    } else {
        throw 'Error: first value of count must be sting or array of two values';
    }

    if (conditions.sql) {
        return query;
    }

    var result = await mysql.promise().query(query);
    return (result[0][0]);

}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.remove = async function (conditions) {
    let where = '',
        query = '';

    if (conditions == undefined) {
        conditions = {};
    }

    if (conditions.where != undefined) {
        where += this.where(conditions.where);
    }

    query = `DELETE FROM \`${this.tableName}\` ${where};`;

    if (conditions.sql != undefined && conditions.sql) {
        return query;
    }

    let result = await mysql.promise().query(query);
    return (!result[0].warningStatus) ? true : false;
}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.removeById = async function (id, sql) {
    if (id == undefined) {
        throw 'Error: param id was undefined';
        return false;
    }
    id = Number(id);
    if (isNaN(id)) {
        throw 'Error: param id must be a number';
        return false;
    }
    //deleting
    let query = `DELETE FROM \`${this.tableName}\` WHERE id = ${id};`;
    if (sql != undefined && sql) {
        return query;
    }
    let result = await mysql.promise().query(query, [id]);
    return (!result[0].warningStatus) ? true : false;
}


//@return object of mysql - mysqlQuery
modelMysql.prototype.query = async function (query) {
    let result = await mysql.promise().query(query);
    return result;
}


//@return true or false of updating
modelMysql.prototype.save = async function (_data) {

    this.checkTypeRules();

    let
        object = _data.data,
        query = "",
        result = "",
        options = "",
        optCount = Object.keys(object).length,
        keyValidation = "",
        errors = [],
        validation = await this.validate(object); //получит либо true либо ошибки валидации

    if (validation != true) {
        for (let key in validation) {
            if (this.validateMessege) {
                let flag = false;
                for (let fieldKey in this.fields) {
                    if (fieldKey == key) {
                        errors.push({ field: key, message: `${validation[key]}` });
                        flag = true;
                    }
                }
                if (!flag) errors.push({ field: key, message: `${validation[key]}` });
            } else {
                errors.push({ field: key, message: `${validation[key]}` });
            }
        }
    }

    if (errors.length) return errors;

    let i = 0;
    for (let key in object) {
        i++;
        if (typeof object[key] == "object" && object[key] != null) {
            object[key] = JSON.stringify(object[key]);
        }
        if (typeof object[key] == 'string') object[key] = this.escapeTag(object[key]);
        typeof object[key] == 'string' ? options += `${key} = '${this.escape(object[key])}'` : options += `${key} = ${object[key]}`;
        if (i != optCount) {
            options += `, `;
        }
    }

    if (_data.id == undefined) {
        //insert
        query = `INSERT \`${this.tableName}\` SET ${options};`;
        if (_data.sql) return query;
        result = await mysql.promise().query(query);
    } else {

        //update
        id = Number(mysql.escape(_data.id));
        if (isNaN(id)) {
            console.log('Error: param id must be a number');
            return false;
        }
        query = `UPDATE ${this.tableName} SET ${options} WHERE id = ${id};`;
        if (_data.sql) return query;
        result = await mysql.promise().query(query);
    }

    return (!result[0].warningStatus) ? true : false;
}


module.exports = modelMysql;
