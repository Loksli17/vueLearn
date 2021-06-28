import mysql2 from 'mysql2';
import config from './../config';

const 
    init = () => {
        mysql2.createPool({
            connectionLimit: 100,
            host           : '127.0.0.1',
            user           : config.db.user,
            password       : config.db.password,
            database       : config.db.name,
            port           : config.db.port,
        });
    };

export default init;