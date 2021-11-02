import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';

interface RoleAttribites {
    id  : number;
    name: string; 
}

export interface RoleCreationAttributes extends Optional<RoleAttribites, 'id'> {}


class Role extends Model<RoleAttribites, RoleCreationAttributes> implements RoleAttribites{
    public id!  : number;
    public name!: string;
}

Role.init({
    
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        primaryKey   : true,
        autoIncrement: true,
    },

    name: {
        type     : DataTypes.STRING(255),
        allowNull: false,
        validate : {
            notNull: {
                msg:  'This field must be not empty',
            },
            isUnique: function(value: string, next: any){
                Role.findOne({where: {name: value}}).then((role: Role | null) => {
                    if(role != null && role.id != this.id){
                        next('This role already has been used');
                    }else{
                        next();
                    }
                }).catch((error) => {
                    next(error);
                });
            }
        }
    }
}, {
    tableName: 'role',
    sequelize,
    timestamps: false,
});


export default Role;

