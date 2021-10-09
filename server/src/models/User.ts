import {Optional, Model, DataTypes, Association} from 'sequelize';
import sequelize                    from '../config/databaseSeq';
import Role                         from './Role';
import UserHasRole                  from './UserHasRole';


interface UserAttributes{
    id          : number;
    email       : string;
    login       : string;
    password    : string;
    avatar      : string;
    refreshToken: string;
    animalId    : number | null;
}


export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}


class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{

    public id!          : number;
    public email!       : string;
    public login!       : string;
    public password!    : string;
    public avatar!      : string;
    public refreshToken!: string;
    public animalId!    : number | null;

    public roles?: Array<Role>;

    public static associations: {
        roles: Association<User, Role>;
    }

    // public readonly createdAt!: Date;
    // public readonly updateAt! : Date;
}


User.init({
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey   : true,
    },

    animalId: {
        type     : DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },

    email: {
        type     : DataTypes.STRING,
        allowNull: false,
        validate : {
            isEmail: {
                msg: 'Input correct e-mail!',
            },
            notNull: {
                msg: 'This field must be not empty',
            },
            isUnique: function(value: string, next: any){
                User.findOne({where: {email: value}}).then((user: User | null) => {
                    if(user != null && user.id != this.id){
                        next('This e-mail already has been used');
                    }else{
                        next();
                    }
                }).catch((error) => {
                    next(error);
                });
            }
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
            notNull: {
                msg: 'This field must be not empty',
            },
        }
    },

    password: {
        type     : DataTypes.STRING,
        allowNull: false,
        validate : {
            notNull: {
                msg: 'This field must be not empty',
            },
        }
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

User.belongsToMany(Role, { through: UserHasRole, foreignKey: 'userId', sourceKey: 'id'});
Role.belongsToMany(User, { through: UserHasRole, foreignKey: 'roleId', sourceKey: 'id'});

export default User;