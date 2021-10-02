import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';
import Books                        from './Books'; 

interface AuthorAttributes {
    id   : number, 
    name : string, 
    style: string, 
}

export interface AuthorCreationAttributes extends Optional<AuthorAttributes, 'id'> {}

export default class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
  public  id!   : number; 
  public  name! : string; 
  public  style!: string; 
}

Author.init({
    id:{
        type         : DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey   : true,
    },
    name: {
        type: new DataTypes.STRING(45),
        unique: true,
    },
    style: {
        type: new DataTypes.STRING(45),
    }
},{
    tableName: 'author',
    sequelize,
    timestamps: false,
});


Author.belongsToMany(
    Books, 
    {
        through: 'Author_books',
        foreignKey: 'authorId',
    }
);