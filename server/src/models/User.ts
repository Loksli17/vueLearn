import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';


interface UserAttributes{
    id      : number,
    email   : string,
    login   : string,
    password: string,
    avatar  : string,
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{

    public id!      : number;
    public email!   : string;
    public login!   : string;
    public password!: string;
    public avatar!  : string;

    // public readonly createdAt!: Date;
    // public readonly updateAt! : Date;
}

User.init({
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey   : true,
    },
    email: {
        type     : DataTypes.STRING,
        allowNull: false,
        unique   : true,
    },
    login: {
        type     : DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'user',
    sequelize,
});


export default User;