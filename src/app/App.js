import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Auth} from "./containers/Auth/Auth";
import {Field} from "./containers/Field/Field";
import {checkIfAuthenticated} from "./util/requests";
import {DragManager} from "./util/dragmanager";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        checkIfAuthenticated().then(isAuthenticated => {
            this.setState({isAuthenticated: isAuthenticated});
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isAuthenticated !== nextState.isAuthenticated;
    }

    login = () => {
        this.setState({isAuthenticated: true});
    };

    render() {

        let routes = (
            <Switch>
                <Route path="/" render={() => <Auth login={this.login}/>}/>
                <Redirect to="/"/>
            </Switch>
        );

        if (this.state.isAuthenticated) {
            routes = (
                <Switch>
                    {/*<Route path="/auth" exact render={() => <Auth login={this.login}/>}/>*/}
                    <Route path="/" render={() => <Field/>}/>
                    <Redirect to="/"/>
                </Switch>
            );
        }

        return (
            <Router>
                {routes}
            </Router>
        );
    }
}

export default App;