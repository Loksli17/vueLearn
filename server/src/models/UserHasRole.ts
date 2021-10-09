import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';

interface UserHasRoleAttribites {
    id    : number;
    userId: string;
    roleId: string;
}


export interface UserHasRoleCreationAttributes extends Optional<UserHasRoleAttribites, 'id'> {}


class UserHasRole extends Model<UserHasRoleAttribites, UserHasRoleCreationAttributes> implements UserHasRoleAttribites{
    public id!    : number;
    public userId!: string;
    public roleId!: string;
}

UserHasRole.init({
    
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        primaryKey   : true,
        autoIncrement: true,
    },

    userId: {
        type     : DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    roleId: {
        type     : DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    
}, {
    tableName: 'userHasRole',
    sequelize,
    timestamps: false,
});

export default UserHasRole;