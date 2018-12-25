import * as React from 'react';
import Logo from '../../images/home/logo.png';
import { Link, NavLink, withRouter } from 'react-router-dom';
import LoginModal from "react-login-modal-sm";
import { Modal, Button } from 'react-bootstrap';

class Header extends React.Component {
    handleLoginWithFacebook = () => {
        // Do something when 'Login with Facebook' is clicked
        this.props.fbLogin();
        console.log("Login with Facebook...");
    };

    onLoginEmail = (email, password) => {
        this.props.emailLogin(email, password);
    }
   
    handleSignupByEmail = (email, username, password) => {
        this.props.emailSignup(email, username, password);
    };
   
    /*Header content section*/
    headertop() {
        let headerTop = (<div className="header_top" >
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="contactinfo">
                            <ul className="nav nav-pills">
                                <li><a href="javascript:void(0)"><i className="fa fa-phone"></i> +2 95 01 88 821</a></li>
                                <li><a href="javascript:void(0)"><i className="fa fa-envelope"></i> info@domain.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="social-icons pull-right">
                            <ul className="nav navbar-nav">
                                <li><a href="javascript:void(0)"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="javascript:void(0)"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="javascript:void(0)"><i className="fa fa-linkedin"></i></a></li>
                                <li><a href="javascript:void(0)"><i className="fa fa-dribbble"></i></a></li>
                                <li><a href="javascript:void(0)"><i className="fa fa-google-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >);

        return headerTop;
    }
    headerBot(props) {
        let headerBottom = (<div className="header-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-sm-9">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="mainmenu pull-left">
                            <ul className="nav navbar-nav collapse navbar-collapse">
                                <li><a href="/" className="active">Home</a></li>
                                <li className="dropdown"><a href="/">Shop<i className="fa fa-angle-down"></i></a>
                                    <ul role="menu" className="sub-menu">
                                        {props==='true'?<li><a href="javascript:void(0)" onClick={this.Logout}> Đăng xuất</a></li>
                                           : <li><a href="/login">Đăng ký tài khoản & Đăng nhập</a></li>
                                        }
                                        
                                        <li><a href="/OrderStatus">Tra cứu đơn hàng</a></li>
                                        <li><a href="/GioHang">Cart</a></li>
                                    </ul>
                                </li>
                                <li><a href="/">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
        return headerBottom;
    }
    /*Header content section*/

    render() {
        console.log('Header.js goooo ' );
        let loggedInContents = <li>
            {/*<NavLink to={'/account/' + this.state.usrID} activeClassName='active'>*/}
            <NavLink to={'/Account/'} activeClassName='active'>
                <span className='fa fa-user'></span> {this.props.usrName}
            </NavLink>
            <a href="javascript:void(0)" onClick={()=>this.props.logOut()}><i className="fa fa-lock" ></i> Logout</a>
        </li>;

        let contents = this.props.loginState ? loggedInContents : <li>
            <a href="javascript:void(0)" onClick={this.props.showModal}><i className="fa fa-lock" ></i> Login</a>
            <LoginModal
                showModal={this.props.showLGmodal}
                toggleModal={this.props.showModal}
                onLoginFacebook={this.handleLoginWithFacebook}
                onSignupEmail={this.handleSignupByEmail}
                onLoginEmail={this.onLoginEmail}
            />
        </li>;

        return <header id="header">
            <this.headertop  />
            <Modal bsSize="small"
                aria-labelledby="contained-modal-title-sm" show={this.props.signupConfirm} onHide={this.props.closeSUconfirm}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>

                <Modal.Body>ĐĂNG KÝ THÀNH CÔNG!!</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.closeSUconfirm}>Trở Về</Button>
                </Modal.Footer>
            </Modal>

            <Modal bsSize="small"
                aria-labelledby="contained-modal-title-sm" show={this.props.showError} onHide={this.props.closeError}>
                <Modal.Header closeButton>
                    <Modal.Title>ERRROR!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>{this.props.error}</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.closeError}>Trở Về</Button>
                </Modal.Footer>
            </Modal>
            {/*Header mid nhét vào đây cho tiện? ???*/}
            <div className="header-middle">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="logo pull-left">
                                <Link className='' to={{ pathname: '/', state : { fromHeader : true } }} stat><img src={Logo} alt="Home" /></Link>
                            </div>
                           
                        </div>
                        <div className="col-sm-8">
                            <div className="shop-menu pull-right">
                                {/*Config Login Logout trong này*/}
                                <ul className="nav navbar-nav">
                                    <li>
                                        <NavLink to={'/OrderStatus'} activeClassName='active'>
                                            <span className='fa fa-star'></span> Check trạng thái đơn hàng của bạn
                            </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to={'/GioHang'} activeClassName='active'>
                                            <span className='fa fa-shopping-cart'></span> Giỏ Hàng
                            </NavLink>
                                    </li>
                                    {/*Login button ? fake button hay laf style tag a dm ?*/}
                                    {contents}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*end mid header section
            <this.headerBot logginState={this.state.loggedIn ? 'true' : 'false'} />*/}
            {this.headerBot(this.props.loginState ? 'true' : 'false')}
        </header>
            ;
    }
}
export default withRouter(Header);