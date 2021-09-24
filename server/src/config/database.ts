import mysql2 from 'mysql2';
import config from './../config';


class Connection{

    private static pool_: mysql2.Pool | undefined;

    private static createPool(){
        return mysql2.createPool({
            host           : config.db.host,
            user           : config.db.user,
            password       : config.db.password,
            database       : config.db.name,
            port           : config.db.port,
        });
    }

    public static get pool(): mysql2.Pool{
        return this.pool_ || (this.pool_ = this.createPool());
    }
}


export default Connection.pool.promise();
