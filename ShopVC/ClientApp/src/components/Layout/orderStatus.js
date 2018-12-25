import React, { Component } from 'react';
import { Modal, Button, Tab, Row, NavItem, Nav, Col } from 'react-bootstrap';
import axios from 'axios';
var idtoken = window.localStorage.firebaseAuthToken;
var AuthStr = 'Bearer '.concat(idtoken);
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});
function getStatus(props) {
    if (props === 'Dang Xu Ly')
        return 'c1';
    else if (props === 'Van chuyen')
        return 'c2';
    else if (props === 'Giao')
        return 'c3'
    return 'c4';
}

 const StatusBar = (function (props) {
    var ngayTao = new Date(Date.parse(props.order.ngayLap));
    return (<div>
        <h4>Your order status:</h4>

        <ul className="list-group">
            <li className="list-group-item">
                <span className="prefix">Date created:</span>
                <span className="label label-success">{ngayTao.toLocaleDateString()}</span>
            </li>
            <li className="list-group-item">
                <span className="prefix">Tổng tiền:</span>
                <span className="label label-success">{formatter.format(props.order.tongGiaTri)}</span>
            </li>
            <li className="list-group-item">
                <span className="prefix">Người nhận:</span>
                <span className="label label-success">{props.order.tenNguoiNhan}</span>
            </li>
            <li className="list-group-item">
                <span className="prefix">Ghi chú:</span>
                <span className="label label-success">{props.order.ghiChu}</span>
            </li>
        </ul>

        <div className="order-status">

            <div className="order-status-timeline">
                <div className={"order-status-timeline-completion " + getStatus(props.order.tinhTrang)}></div>
            </div>

            <div className="image-order-status image-order-status-new active img-circle">
                <span className="status">Đã nhận đơn hàng</span>
                <div className="icon"></div>
            </div>
            <div className="image-order-status image-order-status-active active img-circle">
                <span className="status">Đã xử lý</span>
                <div className="icon"></div>
            </div>
            <div className="image-order-status image-order-status-intransit active img-circle">
                <span className="status">Đã gio cho bên vận chuyển</span>
                <div className="icon"></div>
            </div>
            <div className="image-order-status image-order-status-delivered active img-circle">
                <span className="status">Đã giao</span>
                <div className="icon"></div>
            </div>
            <div className="image-order-status image-order-status-completed active img-circle">
                <span className="status">Hoàn tất</span>
                <div className="icon"></div>
            </div>

        </div>
    </div>);
});
export class OrderStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderInfo: null,
            showResult: false,
            ErrorMess: null,
            notFound: false
        };
        this.getOrderStatus = this.getOrderStatus.bind(this);
    }
    getOrderStatus() {
        const value = document.getElementsByName('orderID')[0].value;
        const state = this;
        axios.get('api/HoaDons/' + value, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true })
            .then(function (response) {
                state.setState({
                    orderInfo: response.data,
                    notFound: false,
                    showResult: true
                });
            }).catch((Error) => {
                state.setState({ ErrorMess: 'Không tìm thấy đơn hàng này', notFound: true, showResult: true });
            });
    }
    render() {
        let foundcontent = this.state.notFound ? <h4>{this.state.ErrorMess} </h4> : <StatusBar order={this.state.orderInfo}/>;
    let contents = this.state.showResult ? foundcontent : null;
        return (<div className="row shop-tracking-status">
            <div className="col-md-12">
                <div className="well">
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="inputOrderTrackingID" className="col-sm-2 control-label">Order id</label>
                            <div className="col-sm-10">
                                <input type="text" name="orderID" className="form-control" id="inputOrderTrackingID" defaultValue="" placeholder="Nhập id đơn hàng của bạn ở đây"/>
                    </div>
                            </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="button" id="shopGetOrderStatusID" className="btn btn-success" onClick={this.getOrderStatus}>Get status</button>
                                </div>
                            </div>
                        </div>
                    {contents}
                </div>
            </div>
        </div>);

}
}