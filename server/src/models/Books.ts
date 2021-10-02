import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';
import Author                       from './Author';

interface BooksAttributes {
    id         : number, 
    title      : string, 
    text       : string,
    writingDate: string, 
    isCompleted: boolean, 

}

export interface BooksCreationAttributes extends Optional<BooksAttributes, 'id'> {}

export default class Books extends Model<BooksAttributes, BooksCreationAttributes> implements BooksAttributes {
    public id!         : number; 
    public title!      : string; 
    public text!       : string;
    public writingDate!: string; 
    public isCompleted!: boolean; 
}


Books.init({
    id:{
        type         : DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey   : true,
    },

    title: {
        type     : new DataTypes.STRING(45),
        allowNull: false,
        unique   : true, 
    },

    text: {
        type: DataTypes.TEXT,
    },

    writingDate:{
        type     : DataTypes.DATE,
        allowNull: false,
    },

    isCompleted:{
        type: DataTypes.BOOLEAN, 
    },
},{
    tableName: 'books',
    sequelize,
    timestamps: false,
});


Books.belongsToMany(
    Author, 
    {
        through   : 'Author_books',
        foreignKey: 'booksId',
    }
);