import React from 'react';
import {socket} from "../../../util/socket";
import {BASE_URL} from "../../../../constants";

const ModelItem = ({type, item}) => {
    const generateFileItem = (fileName) => (
        <a
            className="list-group-item list-group-item-action"
            title={fileName}
            href={`${BASE_URL}/file?filename=${fileName}`}
        >
            <strong className="align-middle">{fileName}</strong>
        </a>
    );

    const generatePlayerItem = (username, isInGame) => (
        <>
            <div className="list-group-item" id={username}>
                <strong className="align-middle">{username}</strong>
                {generatePlayerBadge(username, isInGame)}
            </div>
        </>
    );

    const generatePlayerBadge = (username, isInGame) => (
        <span
            onClick={() => {
                console.log("inviting...");
                console.log(isInGame);
                if (isInGame) return;
                socket.emit("game_invite", username);
            }}
            className={`badge badge-pill float-right p-2 ${isInGame ? "badge-secondary" : "badge-success btn"}`}>
            {isInGame ? "in game" : "send invite"}
        </span>
    );

    switch (type) {
        case "player":
            return generatePlayerItem(item.name, item.isInGame);
        case "file":
            return generateFileItem(item);
        default:
            return null;
    }
};

export default ModelItem;