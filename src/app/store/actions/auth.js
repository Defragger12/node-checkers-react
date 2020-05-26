import axios from 'axios';

import * as actionTypes from './actionTypes';
//
// export const auth = (email, password, isSignup) => {
//     return dispatch => {
//         dispatch(authStart());
//         const authData = {
//             email: email,
//             password: password,
//             returnSecureToken: true
//         };
//         let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDu56rOe0KWP0SWnTZgm3bJwecKWo0I9fs';
//         if (!isSignup) {
//             url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDu56rOe0KWP0SWnTZgm3bJwecKWo0I9fs';
//         }
//         axios.post(url, authData)
//             .then(response => {
//                 const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
//                 localStorage.setItem('token', response.data.idToken);
//                 localStorage.setItem('expirationDate', expirationDate);
//                 localStorage.setItem('userId', response.data.localId);
//                 dispatch(authSuccess(response.data.idToken, response.data.localId));
//                 dispatch(checkAuthTimeout(response.data.expiresIn));
//             })
//             .catch(err => {
//                 dispatch(authFail(err.response.data.error));
//             });
//     };
// };
