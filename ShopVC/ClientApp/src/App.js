import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Cart } from './components/ShoppingCArt';
import { UserProfile } from './components/Userprofile';
import { CheckOut } from './components/CheckOut';
import { LoginPage } from './components/LoginPage';
import { OrderStatus } from './components/Layout/orderStatus';
import { ErrorPage } from './components/Error404';
import PropTypes from "prop-types"
import { firebaseApp } from "./components/base";
import firebase from "firebase";
import axios from 'axios';

Route.propTypes = {
    computedMatch: PropTypes.object,
    path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    sensitive: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    location: PropTypes.object
}
var idtoken = window.localStorage.firebaseAuthToken;
var AuthStr = 'Bearer '.concat(idtoken);
class App extends Component {
    displayName = App.name;
    constructor(props) {
        super(props);
        this.state = {
            pageLoad: true,
            loggin: false,
            showModal: false,
            confirmSignup: false,
            loading:false,
            error: null,
            showError: false,
            loading: false,
            email: null,
            displayName: null,
            oldpath: null
        };
        this.Logout = this.Logout.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loginWithEmail = this.loginWithEmail.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleSignupByEmail = this.handleSignupByEmail.bind(this);
        this.closeSignUpconfirm = this.closeSignUpconfirm.bind(this);
    }


    componentWillMount() {
        console.log('App.js goooo ' + this.state.loggin);
        
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    loggin: true,
                    email: user.email,
                    displayName: user.displayName,
                    pageLoad: false
                });
                console.log(user);
            } else if (!this.state.loading) {
                axios.get('api/getUserinfo', { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true }).then((Response) => {
                    this.setState({
                        loggin: true,
                        email: Response.data.userInfo.mail,
                        displayName: Response.data.userInfo.tenKh,
                        pageLoad: false
                    });
                    console.log(Response.data.tenKh);
                }).catch((Error) => {
                    this.setState({
                        pageLoad: false
                    });
                });
            }
        });
    }
    authenticate() {
        console.log('Login with Facebook form app.js ...');
        const authProvider = new firebase.auth.FacebookAuthProvider();
        firebaseApp
            .auth()
            .signInWithPopup(authProvider)
            .then(this.authHandler);

    };
    authHandler = async authData => {
        console.log(authData);
        var state = this;
        this.setState({ loading: true });
        const user = authData.user;
        const data = JSON.stringify({ email: user.email, displayName: user.displayName });
        firebaseApp.auth().currentUser.getIdToken().then(idToken => {
            window.localStorage.firebaseAuthToken = idToken;
            var AuthStr = 'Bearer '.concat(idToken);
            axios.post('api/savefblogin', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr } }).then(function (response) {
                state.setState({
                    loggin: true,
                    email: user.email,
                    displayName: user.displayName,
                    loading: false,
                });
                console.log(response);
            });

        });
    }
    loginWithEmail(email, password) {
        if (!email || !password) {
            this.setState({
                error: 'Tên đăng nhập và mật khẩu không dc để trống',
                showError: true
            })
        } else {
            const data = JSON.stringify({ email, password });
            axios.post('api/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            ).then((Response) => {
                this.setState({ loggin: true, displayName: Response.data });
            }).catch((Error) => {
                this.setState({
                    error: 'Nhập sai pass hoặc mật khẩu',
                    showError: true
                });
                console.log(Error);
            });
        }
    }
    handleCloseError() {
        this.setState({
            showError: false
        });
    }
    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }
    handleSignupByEmail = (email, username, password) => {
        let state = this;
        const data = JSON.stringify({
            usrEmail: email,
            name: username,
            pass: password
        });
        axios.post('api/register', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            state.setState({
                showModal: false,
                confirmSignup: true
            });
            console.log(response);
        }).catch(function (error) {
            state.setState({
                error: 'EMAIL ĐÃ ĐƯỢC SỬ DỤNG!!!',
                showError: true
            });
            console.log(error);
        });
        console.log("...");
    };
    //log out event
    Logout() {
        console.log('??logout');
        let state = this;
        if (window.confirm("Bạn có muốn Đăng xuất?")) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.setState({
                        email: null, displayName: null, loggin: false, showModal: false, loading: true
                    });
                    firebase.auth().signOut();
                }
            });
            axios.get('api/logout', { withCredentials: true }).then(function (response) {
                console.log(response);
                window.localStorage.clear();
                state.setState({ email: null, displayName: null, loggin: false, showModal: false, loading: false });
            }).catch(function (error) {
                console.log(error);
            });
        }

    }
    closeSignUpconfirm() {
        this.setState({
            confirmSignup: false,
        });
    }
    render() {
        let contents = this.state.pageLoad ? <h3>LOADING.....</h3> : <Layout logOut={this.Logout} emailSignup={this.handleSignupByEmail} signupConfirm={this.state.confirmSignup} closeSUconfirm={this.closeSignUpconfirm} showLGmodal={this.state.showModal} showModal={this.toggleModal} loginState={this.state.loggin} usrName={this.state.displayName ? this.state.displayName : this.state.email} fbLogin={this.authenticate} emailLogin={this.loginWithEmail} error={this.state.error} showError={this.state.showError} closeError={this.handleCloseError} >
            <Switch>
                <Route exact path={['/', '/Danhmuc/:name/:id', '/DetailsanPham/:idSp']} render={(props) => <Home {...props} />} />
                <Route path='/GioHang' render={(props) => <Cart {...props} />} />
                <Route path='/OrderStatus' render={(props) => <OrderStatus {...props} />} />
                <Route path='/Account' render={(props) => (this.state.loggin ? (<UserProfile {...props} />)
                    : (<Redirect to='/login' />)
                )} />
                <Route path='/checkout' render={(props) => (this.state.loggin ? (<CheckOut  {...props} />)
                    : (<Redirect to='/login' />)
                )} />
                <Route exact path='/login' render={(props) => (this.state.loggin ? (<Redirect to='/' />)
                    : (<LoginPage fbLOGIN={this.authenticate} registerwithEmail={this.handleSignupByEmail} loginEmail={this.loginWithEmail} {...props} />)
                )} />
                <Route component={ErrorPage} />
            </Switch>
        </Layout>;
        return (contents);
    }
}
export default withRouter(App);
