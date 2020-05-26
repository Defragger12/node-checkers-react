import React, {useEffect} from 'react';
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import {submitForm} from "../../util/requests";
import {socket} from "../../util/socket";
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

const ActionPanel = (props) => {

    useEffect(() => {
        socket.on('update_inGame_state', ([username, state]) => {
            props.updateInGameState(username, state);
        });

        socket.on('add_user_to_list', ([username, isInGame]) => {
            props.addPlayerToList(username, isInGame);
        });

        socket.on('remove_user_from_list', (username) => {
            props.removePlayerFromList(username)
        });

        props.fetchPlayersOnline();
    }, []);


    // const fetchFilesToDownload = () => {
    //     retrieveUserFileNames().then(fileNames => {
    //         setFileNames(fileNames);
    //     })
    // };

    // const addPlayerToList = (username, isInGame) => {
    //     if (playersOnline.find(player => player.name === username)) {
    //         return;
    //     }
    //     setPlayersOnline([...playersOnline, {name: username, isInGame: isInGame}]);
    // };

    // const updateIsInGameState = (username, isInGame) => {
    //     setPlayersOnline(
    //         playersOnline.map(player => player.name === username ? {
    //             ...player,
    //             isInGame: isInGame
    //         } : player)
    //     );
    // };

    // const removePlayerFromList = (name) => {
    //     setPlayersOnline(playersOnline.filter(player => player.name !== name));
    // };


    const handlePhotoUpload = async (event) => {
        event.preventDefault();

        if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
            return;
        }

        const filename = event.target.files[0].name;
        const ext = filename.substring(filename.lastIndexOf('.'));

        if ([".jpg", ".jpeg", ".bmp", ".gif", ".png"].indexOf(ext) === -1) {
            return;
        }

        let form = event.target.closest('form');
        let data = await submitForm(form);
        this.props.setPlayerAvatar(data.filename, data.color);
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();

        if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
            return;
        }

        let form = event.target.closest('form');
        await submitForm(form);
    };

    return (
        <>
            <div className="m-3">
                <Button id="invite-player-button" targetModal="#playerListModal" label="Invite Player"
                        disabled={props.inviteDisabled}/>
                <Button id="photo-input" action="/upload-photo" name="photodata" label="Upload Photo"
                        handleClick={handlePhotoUpload}/>
                <Button id="file-input" action="/upload-file" name="filedata" label="Upload File"
                        handleClick={handleFileUpload}/>
                <Button id="download-files-button" targetModal="#fileListModal" label="Download File"
                        handleClick={props.fetchFileNames}/>
            </div>
            <Modal type="player" items={props.playersOnline}/>
            <Modal type="file" items={props.fileNames}/>
        </>
    )
};

const mapStateToProps = state => {
    return {
        playersOnline: state.game.playersOnline,
        inviteDisabled: state.game.inviteDisabled,
        fileNames: state.user.fileNames
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setPlayersOnline: (players) => dispatch(actions.setPlayersOnline(players)),
        fetchPlayersOnline: () => dispatch(actions.fetchPlayersOnline()),
        updateInGameState: (username, isInGame) => dispatch(actions.updateInGameState(username, isInGame)),
        addPlayerToList: (username, isInGame) => dispatch(actions.addPlayerToList(username, isInGame)),
        removePlayerFromList: (username) => dispatch(actions.removePlayerFromList(username)),
        fetchFileNames: () => dispatch(actions.fetchFileNames())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActionPanel);