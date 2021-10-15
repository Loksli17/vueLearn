import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';

interface BooksHasAuthorAttributes {
    id    : number;
    authorId: number;
    booksId: number;
}


export interface BooksHasAuthorCreationAttributes extends Optional<BooksHasAuthor, 'id'> {}


class BooksHasAuthor extends Model<BooksHasAuthorAttributes, BooksHasAuthorCreationAttributes> implements BooksHasAuthorCreationAttributes{
    public id!    : number;
    public authorId!: number;
    public booksId!: number;
}

BooksHasAuthor.init({
    
    id: {
        type         : DataTypes.INTEGER.UNSIGNED,
        primaryKey   : true,
        autoIncrement: true,
    },

    authorId: {
        type     : DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    booksId: {
        type     : DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    
}, {
    tableName: 'bookshasauthor',
    sequelize,
    timestamps: false,
});

export default BooksHasAuthor;