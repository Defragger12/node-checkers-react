import React from 'react';
import {submitForm} from "../../util/requests";
import {BASE_URL} from "../../../constants";

const AuthForm = ({action, callback, title}) => {

    const submitAuthForm = (event) => {
        event.preventDefault();

        let form = event.target.closest('form');
        let formData = new FormData(form);
        let parsedForm = {};
        for (let [name, value] of formData.entries()) {
            parsedForm[name] = value;
        }
        submitForm(form, parsedForm).then(result => {
            callback(result);
        });
    };

    return (
        <form action={`${BASE_URL}/${action}`} method="post">
            <h4 className="text-center">{title}</h4>
            <div className="form-group row">
                <label className="col-form-label" htmlFor={`${action}username`}>Username:</label>
                <input className="form-control" type="text" name="username" id={`${action}username`}/>
                <br/>
            </div>
            <div className="form-group row">
                <label className="col-form-label" htmlFor={`${action}password`}>Password:</label>
                <input className="form-control" type="password" name="password" id={`${action}password`}/>
            </div>
            <div className="text-center">
                <input onClick={submitAuthForm} className="btn btn-outline-secondary" type="submit"
                       value="Submit"/>
            </div>
        </form>
    )
};

export default AuthForm;