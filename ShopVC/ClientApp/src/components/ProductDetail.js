import '../css/productdetail.css';
import React, { Component } from 'react';
import axios from 'axios';
import { storage } from "./base";
import { Modal, Button } from 'react-bootstrap';
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});
function getPrice(props) {
    let content;
    if (props.flashDealBd != null && Date.parse(props.flashDealKt) > Date.now()) {
        return content = (<h4 className="price" ><del style={{ 'fontSize': '90%' }}>{formatter.format(props.giaSp)}</del> <br /> <br />Giá FlashDeal: <span>{formatter.format(props.giaFlashDeal)}</span></h4 >);
    } else if (props.ngayBdKm != null && Date.parse(props.ngayKtKm) > Date.now()) {
        return content = (<h4 className="price" ><del style={{ 'fontSize': '90%' }}>{formatter.format(props.giaSp)}</del> <br /> <br />Giá khuyến mại: <span>{formatter.format(props.khuyenMai)}</span></h4 >);
    }
    return content = <h4 className="price">Giá hiện tại: <span>{formatter.format(props.giaSp)}</span></h4>;
}

export default class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            id: null,
            quantity: 1,
            smallModal: false,
            anhSP: null,
            anh1: null,
            anh2: null,
            anh3: null,
        };
        this.handleAddtoCart = this.handleAddtoCart.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseSmall = this.handleCloseSmall.bind(this);
        this.sendToCart = this.sendToCart.bind(this);
    }
    componentDidMount()
    {
        this.loadImages();
        console.log(this.state.anhSP + ' ' + this.state.anh1 + ' ' + this.state.anh2 + ' ' + this.state.anh3);
    }
    loadImages() {
        storage.child(this.props.product.anhSp).getDownloadURL().then((url) => {
            this.setState({
                anhSP: url,
            });
            console.log(this.state.anhSP);
        }).catch((error) => {
            console.log(error);
            });
        storage.child(this.props.product.hinh1).getDownloadURL().then((url) => {
            this.setState({
                anh1: url,
            });
            console.log(this.state.anh1);
        }).catch((error) => {
            console.log(error);
            });
        storage.child(this.props.product.hinh2).getDownloadURL().then((url) => {
            this.setState({
                anh2: url,
            });
        }).catch((error) => {
            console.log(error);
            });
        storage.child(this.props.product.hinh3).getDownloadURL().then((url) => {
            this.setState({
                anh3: url,
            });
        }).catch((error) => {
            console.log(error);
        });
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
    handleAddtoCart() {
        this.setState({ id: this.props.product.idSp, show: true });
    }
    render() {
        return (<div className="container-fliud">
            <div className="wrapper row">
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
                <div className="preview col-md-6">
                    <div className="preview-pic tab-content">
                        <div className="tab-pane active" id="pic-1"><img src={this.state.anhSP} /></div>
                        <div className="tab-pane" id="pic-2"><img src={this.state.anh1} /></div>
                        <div className="tab-pane" id="pic-3"><img src={this.state.anh2} /></div>
                        <div className="tab-pane" id="pic-4"><img src={this.state.anh3} /></div>
                    </div>
                    <ul className="preview-thumbnail nav nav-tabs">
                        <li className="active"><a data-target="#pic-1" data-toggle="tab"><img src={this.state.anhSP} /></a></li>
                        <li><a data-target="#pic-2" data-toggle="tab"><img src={this.state.anh1} /></a></li>
                        <li><a data-target="#pic-3" data-toggle="tab"><img src={this.state.anh2} /></a></li>
                        <li><a data-target="#pic-4" data-toggle="tab"><img src={this.state.anh3} /></a></li>
                    </ul>
                </div>
                <div className="details col-md-6">
                    <h3 className="product-title">{this.props.product.tenSp}</h3>
                    <div className="rating">
                        <div className="stars">
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star"></span>
                            <span className="fa fa-star"></span>
                        </div>
                        <span className="review-no">41 reviews</span>
                    </div>
                    <p className="product-description">{String(this.props.product.thongTinChiTiet)}</p>

                    {getPrice(this.props.product)}
                    <p className="vote"><strong>91%</strong> Người mua thích khuyến mại này <strong>(87 votes)</strong></p>
                    <h5 className="sizes">sizes:
							<span className="size" data-toggle="tooltip" title="small">s</span>
                        <span className="size" data-toggle="tooltip" title="medium">m</span>
                        <span className="size" data-toggle="tooltip" title="large">l</span>
                        <span className="size" data-toggle="tooltip" title="xtra large">xl</span>
                    </h5>
                    <h5 className="colors">colors:
							<span className="color orange not-available" data-toggle="tooltip" title="Not In store"></span>
                        <span className="color green"></span>
                        <span className="color blue"></span>
                    </h5>
                    <div className="action">
                        <button className="add-to-cart-detail btn btn-default" type="button" onClick={this.handleAddtoCart}>add to cart</button>
                    </div>
                </div>
            </div>
        </div>);
    }
}



