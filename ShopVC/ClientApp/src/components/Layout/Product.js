import ProductWrapper from './ProductWrapper';
import ProductText from './ProductText';
import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default class ProductHome extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            id: null,
            quantity: 1,
            smallModal: false
        };
        this.handleAddtoCart = this.handleAddtoCart.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseSmall = this.handleCloseSmall.bind(this);
        this.sendToCart = this.sendToCart.bind(this);
    }
    sendToCart() {
        const state = this;
        const valuetoAdd = document.getElementsByClassName('SangSang ')[0].value;
        const data = JSON.stringify({ id: this.state.id, quantity: valuetoAdd });
        console.log('Sending item to cart..');
        axios.post('api/GioHang/Add', data, { headers: { 'Content-Type': 'application/json' } }).then(Response => {
            state.setState({
                show: false, smallModal: true
            });
            console.log(Response);
        });
    }
    handleClose() {
        this.setState({ show: !this.state.show });
    }
    handleCloseSmall() {
        this.setState({ smallModal: !this.state.smallModal });
    }

    handleAddtoCart(idSP) {
        this.setState({ id: idSP, show: true });
    }
    render() {
        let stop = 1;
        return (
            <div className="col-sm-9 padding-right">
                {/*Modal section*/}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm khuyến mãi này vào giỏ ?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h4>Nhập số lượng bạn muốn mua:</h4>
                        <input className="SangSang" type="number" name="quantity" defaultValue={this.state.quantity} />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Trở Về</Button>
                        <Button bsStyle="primary" onClick={this.sendToCart}>THÊM VÀO GIỎ</Button>
                    </Modal.Footer>
                </Modal>
                <Modal bsSize="small"
                    aria-labelledby="contained-modal-title-sm" show={this.state.smallModal} onHide={this.handleCloseSmall}>
                    <Modal.Header closeButton>
                        <Modal.Title>THÊM THÀNH CÔNG!!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Đã thêm sản phẩm vào giỏ!!!</Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleCloseSmall}>Trở Về</Button>
                    </Modal.Footer>
                </Modal>

                {/*End Modal section*/}
                <div className="features_items">
                    <h2 className="title text-center">Các sản phẩm Hot </h2>
                    {
                        this.props.SPlist.map(sp => {
                            if (stop <= 6) {
                                stop++
                                return <div key={sp.id} className="h1">
                                    <ProductWrapper addtoCart={this.handleAddtoCart} SP={sp} />
                                </div>;
                            }
                        }
                        )}
                </div>

                <div className="recommended_items">
                    <h2 className="title text-center">HOT SALE OFF </h2>
                    <div id="recommended-item-carousel" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            <div className="item active">
                                {this.props.SPlist.filter(sp => sp.sale).map(sp =>
                                    <div key={sp.id} className="col-sm-3">
                                        <div className="product-image-wrapper">
                                            <div className="single-products">
                                                <div className="h1">
                                                    <ProductText addtoCart={this.handleAddtoCart} small={'true'.toString()} SP={sp} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="item">
                                {this.props.SPlist.filter(sp => sp.sale).map(sp =>
                                    <div key={sp.id} className="col-sm-3">
                                        <div className="product-image-wrapper">
                                            <div className="single-products">
                                                <div className="h1">
                                                    <ProductText addtoCart={this.handleAddtoCart} small={'true'.toString()} SP={sp} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                          
                        </div>
                        <a className="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
                            <i className="fa fa-angle-left"></i>
                        </a>
                        <a className="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
                            <i className="fa fa-angle-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            );
    }
}