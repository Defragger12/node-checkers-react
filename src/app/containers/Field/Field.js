import React, {useEffect, useState} from 'react';
import './Field.css';
import {retrieveFieldDataForUser, retrieveUserAvatars, retrieveUserName} from "../../util/requests";
import Square from "../../components/Square/Square";
import {COLOR, RANK} from "../../../constants";
import Photo from "../../components/Photo/Photo";
import ActionPanel from "../ActionPanel/ActionPanel";
import {socket} from "../../util/socket";
import {arePositionsEqual, retrieveCoords, retrieveHowToReachInfo} from "../../../positioning";
import * as actions from '../../store/actions/index';

export const Field = () => {

    const [players, setPlayers] = useState([
        {color: COLOR.BLACK},
        {color: COLOR.WHITE}
    ]);

    const [squares, setSquares] = useState([]);
    const [playerColor, setPlayerColor] = useState(COLOR.WHITE);
    const [inviteDisabled, setInviteDisabled] = useState(false);

    useEffect(() => {
        socket.on('game_invite', (username) => {
            if (window.confirm(`${username} would like to play against you. Accept invite?`)) {
                socket.emit('game_accept', username);
            }
        });

        socket.on('game_init', async ([squares, color]) => {
            drawField(squares, color);
            updatePlayerFinder(true);
            updateUserAvatars();
            highlightActivePlayer(COLOR.WHITE);
        });

        socket.on('game_lost', (username) => {
            alert(`Good game. Player "${username}" won.`);
            updatePlayerFinder(false);
            highlightActivePlayer();
            makeFieldInactive();
        });

        socket.on('game_won', (username) => {
            alert('Well played. You won!');
            updatePlayerFinder(false);
            highlightActivePlayer();
            makeFieldInactive();
        });

        socket.on('player_turn', ([turn, color]) => {
            moveSquare(turn.from, turn.to, turn.isRankUp);
            highlightActivePlayer(color);
        });

        drawField();
        updateUserAvatars();
    }, []);

    const drawField = async () => {
        socket.emit('save_user', await retrieveUserName());

        retrieveFieldDataForUser().then(([squares, color]) => {
            if (squares) {
                setSquares(squares);
                setPlayerColor(color);
                setInviteDisabled(true);
                updatePlayerFinder(true);
            }
        });
    };

    const updateUserAvatars = () => {
        retrieveUserAvatars().then(userAvatars => {
            if (userAvatars.player1) {
                setPlayerAvatar(userAvatars.player1.avatar || "unknown.png", userAvatars.player1.color);
                setPlayerAvatar(userAvatars.player2.avatar || "unknown.png", userAvatars.player2.color);
            } else {
                setPlayerAvatar(userAvatars.player.avatar || "unknown.png");
            }
            highlightActivePlayer(userAvatars.currentTurnColor);
        })
    };

    const setPlayerAvatar = (avatar, color = COLOR.WHITE) => {
        setPlayers(players.map(player => player.color === color ? {...player, avatar: avatar} : player));
    };

    const highlightActivePlayer = (activePlayerColor) => {
        setPlayers(players.map(player => ({...player, isHighlighted: player.color === activePlayerColor})));
    };

    const updatePlayerFinder = (isDisabled) => {
        setInviteDisabled(isDisabled);
    };

    const makeFieldInactive = () => {
        setSquares(squares.map(square => ({...square, isInactive: true})));
    };

    const moveSquare = (from, to, isRankUp) => {
        let pieceToMove = squares.find(square => arePositionsEqual(square.position, from)).piece;
        if (isRankUp) pieceToMove.rank = RANK.QUEEN;
        eraseAllPiecesBetween(from, to);
        setSquares(squares.map(square => arePositionsEqual(square.position, to) ? {
            ...square,
            piece: pieceToMove
        } : square))
    };

    const eraseAllPiecesBetween = (position1, position2) => {

        let {horizontalDirection, verticalDirection, distance} = retrieveHowToReachInfo(position1, position2);
        let {xCoord, yCoord} = retrieveCoords(position1);

        for (let i = 0; i < distance; i++) {
            eraseSquare([xCoord, yCoord]);
            horizontalDirection ? xCoord++ : xCoord--;
            verticalDirection ? yCoord-- : yCoord++;
        }
    };

    const eraseSquare = (position) => {
        setSquares(squares.map(square => arePositionsEqual(square.position, position) ? {
                ...square,
                piece: null
            } : square)
        );
    };

    return (
        <>
            {players.map(player =>
                <Photo key={player.color} avatar={player.avatar} color={player.color}
                       isHighlighted={player.isHighlighted}/>)}
            <ActionPanel inviteDisabled={inviteDisabled} setPlayerAvatar={setPlayerAvatar}/>
            <div id="field">
            {squares.map(square =>
                <Square key={square.position} position={square.position} piece={square.piece}
                    playerColor={playerColor} isInactive={false}/>)}
            </div>
        </>)
};