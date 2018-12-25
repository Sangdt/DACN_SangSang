import React, { Component } from 'react';

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Register = this.Register.bind(this);
    }
    Register(e) {
        e.preventDefault();
        const usrEmail = document.getElementsByName('registerEmail')[0].value;
        const name = document.getElementsByName('registerName')[0].value;
        const pass = document.getElementsByName('registerPass')[0].value;
        this.props.registerwithEmail(usrEmail, name, pass);
    }
    handleSubmit(e) {
        e.preventDefault();
        const email = document.getElementsByClassName('emailLg')[0].value;
        const password = document.getElementsByClassName('passLg')[0].value;
        this.props.loginEmail(email, password);
    }
    render() {

        return (<section id="form">
            <div className="container">
                <div className="row">
                    <div className="col-sm-4 col-sm-offset-1">
                        <div className="login-form">
                            <h2>Login to your account</h2>
                            <form onSubmit={this.handleSubmit}>
                                <a id="errorMess"></a>
                                <input className="emailLg" type="text" placeholder="email" />
                                <input className="passLg" type="password" placeholder="Password" />
                                <button type="submit" className="btn btn-default">Login</button>
                                
                            </form>
                            <button className="loginBtn loginBtn--facebook" onClick={this.props.fbLOGIN}>
                                Login with Facebook
                                </button>
                        </div>
                    </div>
                    <div className="col-sm-1">
                        <h2 className="or">OR</h2>
                    </div>
                    <div className="col-sm-4">
                        <div className="signup-form">
                            <h2>New User Signup!</h2>
                            <form action="#">
                                <input name="registerName" type="text" placeholder="Name" />
                                <input name="registerEmail" type="email" placeholder="Email Address" />
                                <input name="registerPass" type="password" placeholder="Password" />
                                <button type="submit" className="btn btn-default" onClick={this.Register}>Signup</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
    }
}