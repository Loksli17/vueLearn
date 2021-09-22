import config from "./index";

export default{
    "development": {
        "username": config.db.user,
        "password": config.db.password,
        "database": config.db.name,
        "host"    : "127.0.0.1",
        "dialect" : "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
}
