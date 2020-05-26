import Sequelize from "sequelize";
import {SquareModel} from "./model/square";
import {setSaltAndPassword, UserModel} from "./model/user";
import {FieldModel} from "./model/field";
import {PieceModel} from "./model/piece";

const sequelize = new Sequelize("checkers", "root", "root", {
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    logging: false
});

export const Square = SquareModel(sequelize);
export const User = UserModel(sequelize);
export const Field = FieldModel(sequelize);
export const Piece = PieceModel(sequelize);

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);

Field.hasMany(User);
User.belongsTo(Field);
Field.hasMany(Square, {onDelete: "cascade"});
Square.hasOne(Piece, {onDelete: "cascade"});

sequelize.sync({force: true});