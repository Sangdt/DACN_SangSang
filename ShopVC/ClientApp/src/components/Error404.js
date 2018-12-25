import React, { Component } from 'react';
import Error from '../images/404/404.png';
import Logo from '../images/home/logo.png';
import { Link, NavLink } from 'react-router-dom';

export class ErrorPage extends Component {

    render() {
        return (<div className="container text-center">
            <div className="logo-404">
                <a href="index.html"><img src={Logo} alt="" /></a>
            </div>
            <div className="content-404">
                <img src={Error} class="img-responsive" alt="" />
                <h1><b>OPPS!</b>Chúng tôi không thể thực hiện yêu cầu này </h1>
                <p>Uh... Có vẻ như bạn đã yêu cầu một trang nào đó không tồn tại!!</p>
                <Link className='' to={'/'}><h2><a>Về trang chủ</a></h2></Link>
            </div>
        </div>);
    }
}