import {DataTypes} from "sequelize";

export const FieldModel = (sequelize) => {
    return sequelize.define("field", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        currentTurnColor: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
};


