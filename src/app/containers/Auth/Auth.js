import React, {useState} from 'react';
import AuthForm from "../../components/AuthForm/AuthForm";
import Alert from "../../components/Alert/Alert";
import * as actions from '../../store/actions/index';

export const Auth = ({login}) => {

    const [message, setMessage] = useState({});

    const registerCallback = (data) => {
        setMessage({
            alertText: data.message.text,
            alertType: data.message.type
        });
    };

    const loginCallback = (data) => {
        setMessage({
            alertText: data.message.text,
            alertType: data.message.type
        });
        if (data.message.type === "success") {
            login();
        }
    };

    return (
        <>
            <Alert message={message.alertText} type={message.alertType}/>
            <div className="container col-4 col-md-2 mt-4">
                <AuthForm action="login" callback={loginCallback} title="Login"/>
                <hr/>
                <AuthForm action="register" callback={registerCallback} title="Register"/>
            </div>
        </>
    )
};