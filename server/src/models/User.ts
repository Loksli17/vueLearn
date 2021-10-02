import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';


interface UserAttributes{
    id          : number;
    email       : string;
    login       : string;
    password    : string;
    avatar      : string;
    refreshToken: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{

    public id!         : number;
    public email!      : string;
    public login!      : string;
    public password!   : string;
    public avatar!     : string;
    public refreshToken!: string;

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
        validate : {
            isEmail: {
                msg: 'Input correct e-mail!',
            },
        },
        unique: {
            name: 'email',
            msg : 'This e-mail has been used',
        },      
    },

    login: {
        type     : DataTypes.STRING,
        allowNull: false,
        validate : {
            len: {
                msg: 'Length must has symbols amount between 6 and 20',
                args: [6, 20],
            },
        }
    },

    password: {
        type     : DataTypes.STRING,
        allowNull: true,
    },

    avatar: {
        type: DataTypes.STRING,
    },

    refreshToken: {
        type     : DataTypes.STRING, 
        allowNull: true,
    },

}, {
    tableName: 'user',
    sequelize,
    timestamps: false,
});


export default User;