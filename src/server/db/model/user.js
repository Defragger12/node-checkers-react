import {DataTypes} from "sequelize";
import {encryptPassword, generateSalt} from "../../api/auth";

export const UserModel = (sequelize) => {
    return sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            get() {
                return () => this.getDataValue('password')
            }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salt: {
            type: DataTypes.STRING,
            get() {
                return() => this.getDataValue('salt')
            }
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
};

export const setSaltAndPassword = user => {
    if (user.changed('password')) {
        user.salt = generateSalt();
        user.password = encryptPassword(user.password(), user.salt())
    }
};
