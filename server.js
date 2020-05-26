import express from "express";
import {PORT} from "./src/constants";
import {
    FIELDS,
    findPlayerInCache, findSocketInCacheBySocketId,
    findSocketInCacheByUsername,
    findUserFieldInCache,
    SOCKET_TO_USER
} from "./src/server/constants";
import {middleware} from "./src/server/api/middleware";
import {auth} from "./src/server/api/auth";
import {game} from "./src/server/api/game";
import socket from "socket.io";
import {Field, User} from "./src/server/db/init";
import {Field as ClientField} from "./src/model/field";
import {moveSquare, prepareFieldForUsers} from "./src/server/db/util";
import {findSquareByPosition} from "./src/positioning";

let app = express();
middleware(app);
auth(app);
game(app);

export const server = app.listen(PORT);

console.log("SERVER STARTED");

const io = socket(server);

io.on('connection', (socket) => {

    socket.on('game_invite', (username) => {
        let targetSocket = findSocketInCacheByUsername(username).socket;
        if (targetSocket.id === socket.id) {
            return;
        }
        targetSocket.emit(
            'game_invite',
            findSocketInCacheBySocketId(socket.id).username
        );
    });

    socket.on('game_accept', async (username) => {
        let acceptedSocket = findSocketInCacheByUsername(username);
        let invitingSocket = findSocketInCacheBySocketId(socket.id);

        let parsedField = ClientField.convertFromDB(await prepareFieldForUsers(invitingSocket.username, username));

        FIELDS.push(parsedField);

        let createdUsers = parsedField.users;

        socket.emit('game_init', [
            parsedField.squares,
            createdUsers.find(user => user.username === invitingSocket.username).color
        ]);
        socket.broadcast.emit('update_inGame_state', [invitingSocket.username, true]);

        acceptedSocket.socket.emit('game_init', [
            parsedField.squares,
            createdUsers.find(user => user.username === acceptedSocket.username).color
        ]);
        acceptedSocket.socket.broadcast.emit('update_inGame_state', [acceptedSocket.username, true]);
    });

    socket.on('save_user', (username) => {
        let existingSocket = SOCKET_TO_USER.find(element =>
            (element.socket.id === socket.id || element.username === username)
        );
        if (existingSocket) {
            SOCKET_TO_USER.splice(SOCKET_TO_USER.indexOf(existingSocket), 1);
        }

        SOCKET_TO_USER.push({socket: socket, username: username});
        socket.broadcast.emit('add_user_to_list', [username, isUserInGame(username)]);
    });

    socket.on('player_turn', async ({from, to}) => {

        let {player, enemy, field} = retrieveUserRelatedData(socket);

        if (player.color !== field.currentTurnColor) {
            return;
        }

        let enemySocket = findSocketInCacheByUsername(enemy.username);
        let turn = findSquareByPosition(from, field.squares).moveTo(to);

        if (!turn) {
            return;
        }

        if (enemySocket) {
            enemySocket.socket.emit('player_turn', [turn, field.currentTurnColor]);
        }
        socket.emit('player_turn', [turn, field.currentTurnColor]);

        if (!turn.defeatedColor) {
            await moveSquare(turn, field);
            await Field.update({currentTurnColor: field.currentTurnColor}, {where: {id: field.id}});
            return;
        }

        await User.update({color: null}, {where: {username: player.username}});
        await User.update({color: null}, {where: {username: enemy.username}});

        socket.emit('game_won', player.username);
        socket.broadcast.emit('update_inGame_state', [player.username, false]);
        enemySocket.socket.emit('game_lost', player.username);
        enemySocket.socket.broadcast.emit('update_inGame_state', [enemy.username, false]);
        FIELDS.splice(FIELDS.indexOf(field), 1);
        await Field.destroy({where: {id: field.id}});
    });

    socket.on('disconnect', () => {

        let socketElement = findSocketInCacheBySocketId(socket.id);
        if (!socketElement) {
            return;
        }
        socket.broadcast.emit('remove_user_from_list', socketElement.username);
        SOCKET_TO_USER.splice(SOCKET_TO_USER.indexOf(socketElement), 1);
        console.log("disconnected")
    });
});

export const isUserInGame = (username) => {
    return findUserFieldInCache(username) != null
};

const retrieveUserRelatedData = (socket) => {
    let username = findSocketInCacheBySocketId(socket.id).username;
    let userfield = findUserFieldInCache(username);
    let player = findPlayerInCache(username);
    let enemy = findPlayerInCache(username, true);

    return {player: player, enemy: enemy, field: userfield};
};