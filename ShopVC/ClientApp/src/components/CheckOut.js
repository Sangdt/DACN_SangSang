import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import OrderSuccess from './Success';
import Cookies from 'js-cookie';
import {CartItems} from './ShoppingCArt';
import 'isomorphic-fetch';
import Axios from 'axios';
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});
export class CheckOut extends Component {
    constructor() {
        super();
        this.state = {
            caritems: [],
            total: null,
            show: false,
            showFinishCheckout: false,
            showError: false,
            error: null,
            success: false,
            maDH: null,
            tenNguoiDat: null,
            diaChiDatHang: null,
            phoneNumber: null,
            idKH: Cookies.get('SShopVCCookiessID'),
            mess: null
        };
        console.log('Checkout.js goooo ');
        this.showDeleteWarning = this.showDeleteWarning.bind(this);
        this.deleteCartItems = this.deleteCartItems.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.toFinishCheckout = this.toFinishCheckout.bind(this);
        this.finishCheckout = this.finishCheckout.bind(this);
        fetch('api/Cart')
            .then(response => response.json())
            .then(data => {
                this.setState({ caritems: data.cartItemsModelViews, total: data.total }, function ()
                {
                    if (!this.state.caritems.length > 0) {
                        this.setState({
                            showError: true,
                            error: 'Chưa có món hàng nào để thanh toán'
                        })
                    }
                });
            });
    }
    
    handleClose() {
        this.setState({
            show: false, showError: false, showFinishCheckout: false
        });
        if (this.state.error === 'Chưa có món hàng nào để thanh toán') {
            this.props.history.push('/');
        }
    }
    showDeleteWarning(e) {
        var spid = e.currentTarget.getAttribute('id');
        var cartid = document.getElementsByClassName('cartid ' + spid)[0].id;
        this.setState({
            show: true,
            idsp: spid,
            cartID: cartid
        });

    }
    deleteCartItems() {
        {/*api/Cart/delete/{cartID}/spID*/ }
        const Cartstate = this;
        Axios.get('api/Cart/delete/' + Cartstate.state.cartID + '/' + Cartstate.state.idsp, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then(function (response) {
            window.alert('Đã xóa thành công sản phẩm!!');
            if (response.data == 'Cart Empty') {
                Cartstate.setState({
                    caritems: [],
                    total: 0
                });
            } else {
                Cartstate.setState({
                    caritems: response.data.cartItemsModelViews,
                    total: response.data.total
                });
            }
        }).catch(function (error) {
            console.log(error.data)
            window.alert(error.data)
        });

        this.handleClose();
    }
    toFinishCheckout() {
        var selvalue = document.getElementById("CitytoShip");
        const ctyToship = selvalue.options[selvalue.selectedIndex].text;
        const Address = document.getElementsByClassName('Address')[0].value;
        const ordrName = document.getElementsByClassName('PName')[0].value;
        const pNumer = document.getElementsByClassName('PhoneNumber')[0].value;
        if (!selvalue || ctyToship === '-- Thành Phố --' || !Address || !ordrName || !pNumer) {
            this.setState({ showError: true, error : 'Bạn Chưa điền đủ thông giao hàng!!!' });
        } else {
            this.setState({
                tenNguoiDat: ordrName,
                diaChiDatHang: Address,
                mess: document.getElementsByClassName('message')[0].value,
                phoneNumber: pNumer,
                showFinishCheckout: true
            });
        }
    }
    finishCheckout() {
        var idToken= window.localStorage.firebaseAuthToken;
        var AuthStr = 'Bearer '.concat(idToken);
        const state = this;
        const data = JSON.stringify({
            IdKh: this.state.idKH,
            TenNguoiNhan: this.state.tenNguoiDat,
            DiaChi: this.state.diaChiDatHang,
            SDT: parseInt( this.state.phoneNumber),
            NgayLap: new Date(),
            TongGiaTri: this.state.total,
            MessfromClient: this.state.mess
        });
        Axios.post('api/HoaDons', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true })
            .then(function (response) {
                state.setState({ maDH: response.data, success: true });
            });
    }
    render() {
        let tc = parseFloat(this.state.total) + 20;

        let content = this.state.success ? <OrderSuccess maDH={this.state.maDH} /> : <section id="cart_items">
            {/*Modal section*/}
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>Bạn có chắc muốn xóa khuyến mãi này ra khỏi giỏ ?</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.deleteCartItems}>Xóa!!!</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showFinishCheckout} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>XÁC NHẬN ĐƠN HÀNG</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h4 style={{ color: '#FA4A79' }}>XÁC NHẬN THÔNG TIN ĐƠN HÀNG</h4>
                    <p>Địa chỉ:<strong>{this.state.diaChiDatHang}</strong><br /><br />
                        Tổng tiền hàng(bao gồm tiền ship) : <strong>{formatter.format(tc)}</strong><br /><br />
                        Lời nhắn cho người bán :<strong>{this.state.mess}</strong>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.finishCheckout}>ĐẶT ĐƠN HÀNG NÀY</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showError} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lỗi!!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.state.error}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Trở Về</Button>
                </Modal.Footer>
            </Modal>
            {/*End Modal section*/}
            <div className="container">
                <div className="breadcrumbs">
                    <ol className="breadcrumb">
                        <li><a href="/">Home</a></li>
                        <li><a href="/GioHang">Giỏ Hàng</a></li>
                        <li className="active">Đặt Hàng</li>
                    </ol>
                </div>


                <div className="shopper-informations">
                    <div className="row ">
                        <div className="col-xs-12 col-md-8 col-md-offset-4  ">
                            <div className="bill-to">
                                <p>Thông tin Giao Hàng</p>
                                <div className="form-one">
                                    <form>
                                        <input type="text" className="Email" placeholder="Email*" />
                                        <input type="text" className="PName" placeholder="Tên người nhận *" />
                                        <input type="text" className="Address" placeholder="Địa chỉ *" />
                                        <input type="text" className="PhoneNumber" placeholder="Số Điện Thoại" />
                                    </form>
                                    <form>
                                        <select id="CitytoShip">
                                            <option>-- Thành Phố --</option>
                                            <option>Hà Nội</option>
                                            <option>Hồ Chí Minh</option>
                                            <option>Long An</option>
                                            <option>Đà Nẵng</option>
                                            <option>Phú Quốc</option>
                                            <option>Vũng Tàu</option>
                                            <option>Nha trang</option>
                                            <option>Đà Lạt</option>
                                        </select>
                                    </form>
                                    <div className="order-message">
                                        <p>Lời nhắn:</p>
                                        <input className="message" name="messageForSeller" placeholder="Để lại lời nhắn cho người bán!" rows="16" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="review-payment">
                    <h2>Danh sách sản phẩm</h2>
                </div>

                <div className="table-responsive cart_info">
                    <table className="table table-condensed">
                        <thead>
                            <tr className="cart_menu">
                                <td className="image">Item</td>
                                <td className="description"></td>
                                <td className="price">Giá</td>
                                <td className="quantity">Số Lượng</td>
                                <td className="total">Tổng cộng</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.caritems.map(items =>
                                <CartItems items={items} showUpdate={'false'} deleteWarning={this.showDeleteWarning} />
                            )}
                            <tr>
                                <td colSpan="4">&nbsp;</td>
                                <td colSpan="2">
                                    <table className="table table-condensed total-result">
                                        <tbody>
                                            <tr>
                                                <td>Tổng Tiền của giỏ hàng: </td>
                                                <td>{formatter.format(this.state.total)}</td>
                                            </tr>
                                            <tr className="shipping-cost">
                                                <td>Phí Ship:</td>
                                                <td>$20</td>
                                            </tr>
                                            <tr>
                                                <td>Tổng tiền hàng: </td>
                                                <td><span>{formatter.format(tc)}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="add-to-cart-detail btn btn-default" type="button" onClick={this.toFinishCheckout}>ĐẶT HÀNG</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </section>;
        return (content);
    }

}