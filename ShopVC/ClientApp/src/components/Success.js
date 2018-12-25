import success from '../images/404/payment-successful.png';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/home/logo.png';


export default function OrderSuccess(props) {
    return (
        <div className="container text-center">
            <div className="logo-404">
                <a href="/"><img src={Logo} alt="" /></a>
            </div>
            <div className="content-404">
                <img src={success} class="img-responsive" alt="" />
                <h1>Đặt hàng thành công, Mã đơn hàng:{props.maDH}</h1>
                <p>Đơn hàng của bạn đang được Shop xử lý !!</p>
                <Link className='' to={'/'}><h2><a>Tiếp Tục mua sắm</a></h2></Link>
            </div>
        </div>
        );
}