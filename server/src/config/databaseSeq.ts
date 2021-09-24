import { Dialect, Sequelize } from "sequelize";
import config                 from "./index";

const connection = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host   : config.db.host,
        dialect: 'mysql'
    }
);

export default connection;