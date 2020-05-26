import {DataTypes} from "sequelize";

export const PieceModel = (sequelize) => {
    return sequelize.define("piece", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        rank: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
};