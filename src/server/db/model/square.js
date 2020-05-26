import {DataTypes} from "sequelize";

export const SquareModel = (sequelize) => {
    return sequelize.define("square", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        positionX: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        positionY: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
};