import mysql2 from 'mysql2';
import config from './../config';

const init = () => {
    try {
        return mysql2.createPool({
            connectionLimit: 10,
            host           : '127.0.0.1',
            user           : config.db.user,
            password       : config.db.password,
            database       : config.db.name,
            port           : config.db.port,
        }).promise();

    } catch (error) {
        console.error(error);   
    }
};

export default init;