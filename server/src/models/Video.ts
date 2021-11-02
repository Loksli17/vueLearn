import {Optional, Model, DataTypes} from 'sequelize';
import sequelize                    from '../config/databaseSeq';


interface VideoAttributes {
    id         : number;
    name       : string;
    description: string;
    file       : string; 
}

export interface VideoCreationAttributes extends Optional<VideoAttributes, 'id'> {}


class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {

    public id!         : number;
    public name!       : string;
    public description!: string;
    public file!       : string;
}

Video.init({

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
                Video.findOne({where: {name: value}}).then((video: Video | null) => {
                    if(video != null && video.id != this.id){
                        next('This video already has been created');
                    }else{
                        next();
                    }
                }).catch((error) => {
                    next(error);
                });
            }
        }
    },

    description: {
        type     : DataTypes.STRING(255),
        allowNull: true, 
    },

    file: {
        type     : DataTypes.STRING(255),
        allowNull: false,
        validate : {
            notNull: {
                msg:  'This field must be not empty',
            },
            isUnique: function(value: string, next: any){
                Video.findOne({where: {name: value}}).then((video: Video | null) => {
                    if(video != null && video.id != this.id){
                        next('This video already has been created');
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
    tableName: 'video',
    sequelize,
    timestamps: false,
})


export default Video;