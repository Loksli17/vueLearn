import {Optional, Model, DataTypes, Association} from 'sequelize';
import sequelize                                 from '../config/databaseSeq';
import User                                      from './User';

interface AnimalAttributes{
    id  : number;
    name: string;
    type: string;
}


export interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id'> {}

class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes{

    public id!  : number;
    public name!: string;
    public type!: string;

    public users?: Array<User>;

    public static associations: {
        users: Association<Animal, User>;
    }

    // public readonly createdAt!: Date;
    // public readonly updateAt! : Date;
}

Animal.init({
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey   : true,
    },

    name: {
        type     : DataTypes.STRING(255),
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

    type: {
        type     : DataTypes.STRING(255),
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

}, {
    tableName: 'animal',
    sequelize,
    timestamps: false,
});


Animal.hasMany(User, {
  sourceKey : "id",
  foreignKey: "animalId",
  as        : "users",
});

User.belongsTo(Animal);

export default Animal;