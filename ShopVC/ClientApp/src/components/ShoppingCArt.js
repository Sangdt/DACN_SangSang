import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'isomorphic-fetch';
import { storage } from "./base";

import Axios from 'axios';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});
function getPrice(props) {
    if (props.flashDeal) {
        return props.giaFlashDeal;
    } else if (props.khuyenMai && Date.parse(props.ngayKTKhuyenmai) > Date.now())
        return props.giaKM;
    return props.pricesP;
}
export class CartItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caritems: props.items,
            imgL: null,
            showUpdate: true
        }
        if (this.props.showUpdate !== 'true') {
            this.setState({ showUpdate: false });
        }
        storage.child(this.state.caritems.imgLink).getDownloadURL().then((url) => {
            this.setState({
                imgL: url,
            });
            console.log(this.state.anhSP);
        }).catch((error) => {
            console.log(error);
        });
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.items !== prevProps.items) {
            this.setState({
                caritems: this.props.items
            });
        }
    }
    render() {
        console.log(this.state.imgL);
        return ( <tr key={this.state.caritems.tenSP}>
                    <td className="cart_product">
                        {/*items.ImgLink*/}
                        <a href="javascript:void(0)"><img className="img_cart" src={this.state.imgL} alt="" /></a>
                    </td>
                    <td className="cart_description">
                        <h6><a style={{ fontSize: 'medium' }} href="">{this.state.caritems.tenSP}</a></h6>
                <p className={"cartid " + this.state.caritems.spId} id={this.state.caritems.cartID}>Web ID: {this.state.caritems.cartID}</p>
                    </td>
                    <td className="cart_price">
                        <p>{formatter.format(getPrice(this.state.caritems))}</p>
                    </td>
            
            {this.state.showUpdate ? (<td className="cart_quantity"> <input className={"cart_quantity_input " + this.state.caritems.spId} type="number" name="quantity" defaultValue={this.state.caritems.quantity} size="2" min="1" />
                <button className="btn btn-default" id={this.state.caritems.spId} onClick={this.props.updateValue}>Update</button></td>)
                : <td className="cart_quantity"><h6><a style={{ fontSize: 'large' }}>{this.state.caritems.quantity}</a></h6></td>}
               

                    <td className="cart_total">
                <p className="cart_total_price">{formatter.format(this.state.caritems.unitPrice)}</p>
                    </td>
            <td className="cart_delete">
                <a className="cart_quantity_delete" id={this.state.caritems.spId} onClick={this.props.deleteWarning} href="javascript:void(0)"><i className="fa fa-times"></i></a>
                    </td>
            </tr>);
    }
}
export class Cart extends Component {
    displayName = Cart.name
    constructor(props) {
        super(props);
        this.state = {
            caritems: [],
            total: null,
            show: false,
            showError: false,
            imgL: null,
            idsp: null,
            cartID: null
        }
       
        this.UpdateCartValue = this.UpdateCartValue.bind(this);
        this.showDeleteWarning = this.showDeleteWarning.bind(this);
        this.deleteCartItems = this.deleteCartItems.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.toCheckOut = this.toCheckOut.bind(this);
        this.toHome = this.toHome.bind(this);
        fetch('api/Cart')
            .then(response => response.json())
            .then(data => {
                this.setState({ caritems: data.cartItemsModelViews, total: data.total });
            });
    }

    UpdateCartValue(e) {
        const idsp = e.target.id;
        const cartID = document.getElementsByClassName('cartid ' + idsp)[0].id;
        const valuetoupdate = document.getElementsByClassName('cart_quantity_input ' + idsp)[0].value;
        const data = JSON.stringify({ CartID: cartID, SpId: idsp, Quantity: valuetoupdate });
        const state = this;
        Axios.post('api/Cart/update', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then(function (response) {
            console.log(response.data.total)
            state.setState({
                caritems: response.data.cartItemsModelViews,
                total: response.data.total
            });
        });
    }
    handleClose() {
        this.setState({ show: false, showError: false });
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
    getTotal() {
        var a = parseFloat(this.state.total);
        return a + 20;
    }
    toHome() {
        this.props.history.push('/');
    }

    toCheckOut() {
        if (this.state.caritems.length > 0) {
            this.props.history.push('/checkout');
        }
        else {
            this.setState({ showError: true });
        }
    }
    render() {
        let tc = parseFloat(this.state.total) + 20;
        return <div>
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
            <Modal show={this.state.showError} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>CART EMPTY!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>Bạn chưa có sản phẩm nào trong giỏ!!!</Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.toHome}>Quay về trang chủ</Button>
                </Modal.Footer>
            </Modal>

            {/*End Modal section*/}

            <section id="cart_items">
                <div className="container">
                    {/* Direction*/}
                    <div className="breadcrumbs">
                        <ol className="breadcrumb">
                            <li><a href="/">Home</a></li>
                            <li className="active">Shopping Cart</li>
                        </ol>
                    </div>
                    {/*Cart items*/}
                    <div className="table-responsive cart_info">
                        <table className="table table-condensed">
                            <thead>
                                <tr className="cart_menu">
                                    <td className="image">Item</td>
                                    <td className="description"></td>
                                    <td className="price">Giá</td>
                                    <td className="quantity">Số Lượng</td>
                                    <td className="total">Tổng Tiền</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.caritems.map(items =>
                                    <CartItems items={items} showUpdate={'true'} updateValue={this.UpdateCartValue} deleteWarning={this.showDeleteWarning} />
                                )}
                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section id="do_action">
                <div className="container">
                    <div className="heading">
                        <h3>Thông tin giỏ hàng</h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="total_area">
                                <ul>
                                    <li>Tổng cộng <span>{formatter.format(this.state.total)}</span></li>
                                    <li>Shipping Cost <span>$20</span></li>
                                    <li>Total <span>{formatter.format(tc)}</span></li>
                                </ul>
                                <a className="btn btn-default check_out" onClick={this.toCheckOut}>MUA HÀNG</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>;
    }
}