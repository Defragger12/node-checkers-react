import path from "path";
import {retrieveFieldForUser} from "../db/util";
import {isAuthenticated} from "./auth";
import {SOCKET_TO_USER, findPlayerInCache, findCurrentTurnColorInCache} from "../constants";
import {isUserInGame} from "../../../server";
import {User} from "../db/init";
import fs from "fs";
import formidable from "formidable";
import multer from "multer";
import {storage} from "./middleware";
import util from "util";

export let game = (app) => {
    app.get('/players', (req, res) => {
        let usernames = SOCKET_TO_USER.map(socket => socket.username).filter(username => username !== req.user.username);

        res.json(usernames.map(username => {
            return {name: username, isInGame: isUserInGame(username)}
        }));
    });

    app.get('/field', async (req, res) => {
        let username = req.user.username;
        let field = await retrieveFieldForUser(username);
        if (!field) {
            res.json();
            return;
        }
        let playerColor = field.users.find(user => user.username === username).color;
        res.json([field.squares, playerColor]);
    });

    app.post("/upload-photo", multer({storage}).single("photodata"), async (req, res) => {

        let filename = req.file.filename;
        let username = req.user.username;

        let oldAvatarName;
        let existingUser = findPlayerInCache(username);
        if (existingUser) {
            oldAvatarName = existingUser.avatar;
            existingUser.avatar = filename;
        } else {
            existingUser = await User.findOne({where: {username: username}, attributes: ['avatar']});
            oldAvatarName = existingUser.avatar;
        }

        if (oldAvatarName) {
            fs.unlinkSync(path.join(__dirname, `../../../public/assets/photos/${oldAvatarName}`));
        }

        await User.update({avatar: filename}, {where: {username: username}});

        res.json({filename: filename, color: existingUser.color});
    });

    app.post("/upload-file", async (req, res) => {

        let username = req.user.username;
        let dirPath = path.join(__dirname, `../../../public/uploads/${username}`);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        let form = new formidable.IncomingForm();

        form.parse(req);
        form.on('fileBegin', function (name, file){
            if (fs.existsSync(`${dirPath}/${file.name}`)) {
                fs.unlinkSync(`${dirPath}/${file.name}`);
            }
            file.path = `${dirPath}/${file.name}`;
        });

        res.sendStatus(200);
    });

    app.get('/auth', (req, res) => {
        res.json(req.isAuthenticated());
    });

    app.get('/username', (req, res) => res.json(req.user.username));

    app.get('/useravatars', async (req, res) => {

        let username = req.user.username;

        let player = findPlayerInCache(username);
        if (!player) {
            player = await User.findOne({where: {username: username}, attributes: ['avatar', 'id']});
            if (!fs.existsSync(path.join(__dirname, `../../../public/assets/photos/${player.avatar}`))) {
                await player.update({avatar: null});
            }
            res.json({player: {avatar: player.avatar}});
            return;
        }
        let enemy = findPlayerInCache(username, true);

        if (!fs.existsSync(path.join(__dirname, `../../../public/assets/photos/${player.avatar}`))) {
            player.avatar = null;
            User.update({avatar: null}, {where: {username: player.username}});
        }

        if (!fs.existsSync(path.join(__dirname, `../../../public/assets/photos/${enemy.avatar}`))) {
            enemy.avatar = null;
            User.update({avatar: null}, {where: {username: enemy.username}});
        }
        res.json({
            player1: {color: player.color, avatar: player.avatar},
            player2: {color: enemy.color, avatar: enemy.avatar},
            currentTurnColor: findCurrentTurnColorInCache(player.username)
        });
    });

    app.get('/files', async (req, res) => {

        let username = req.user.username;

        let dirPath = path.join(__dirname, `../../../public/uploads/${username}`);
        console.log(dirPath);
        if (!fs.existsSync(dirPath)) {
            console.log("not exists");
            res.json([]);
            return;
        }

        const readdir = util.promisify(fs.readdir);
        res.json(await readdir(dirPath));
    });

    app.get('/file', (req, res) => {
        let username = req.user.username;
        let dirPath = path.join(__dirname, `../../../public/uploads/${username}`);

        res.download(`${dirPath}/${req.query.filename}`);
    });
};

