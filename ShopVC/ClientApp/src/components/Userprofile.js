import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { storage } from './base';

{/*Get Authorization config section*/}
var idtoken = window.localStorage.firebaseAuthToken;
var AuthStr = 'Bearer '.concat(idtoken);
{/*Get Authorization config section*/ }

{/*Get status for order section*/ }
function getStatus(props) {
    if (props === 'Dang Xu Ly')
        return 'c1';
    else if (props === 'Van chuyen')
        return 'c2';
    else if (props === 'Giao')
        return 'c3'
    return 'c4';
}
{/*Get status for order section*/ }


{/*order detail for popup section*/ }

class Orderdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadImg: false,
            img: null
        };
        storage.child(this.props.orderDetail.img).getDownloadURL().then((url) => {
            this.setState({
                img: url,
                loadImg: true
            });
        }).catch((error) => {
            console.log(error);
        });
    };

    render()
    {
        let contents = this.state.loadImg ? <tbody>
            <tr>
                <td><img className="img_cart" src={this.state.img} /></td>
                <td>{this.props.orderDetail.tenSP} </td>
                <td>{formatter.format( this.props.orderDetail.giaSP)} </td>
                <td>{this.props.orderDetail.soLuong} </td>
                <td>{formatter.format(this.props.orderDetail.total)}</td>
                </tr>
        </tbody> : 'loading';
        return contents;
    }
}

{/*order detail for popup section*/ }

{/*formatter for money section*/ }

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
});
{/*formatter for money  section*/ }

{/*UserProfile  section*/ }

export class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            updateUsr: false,
            loading: true,
            showUpdate: false,
            showPass: false,
            showDetailOrder: false,
            showReport:false,
            usrOrder: [],
            orderDetail: [],
            complete: false,
            idDHReport: null
        };
        this.Showupdate = this.Showupdate.bind(this);
        this.handleupdateClose = this.handleupdateClose.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.ShowPassUpdate = this.ShowPassUpdate.bind(this);
        this.ShowUsr = this.ShowUsr.bind(this);
        this.updatePass = this.updatePass.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.closeDetail = this.closeDetail.bind(this);
        this.updateTinhtrang = this.updateTinhtrang.bind(this);
        this.showReport = this.showReport.bind(this);
        this.closeReport = this.closeReport.bind(this);
        this.sendReport = this.sendReport.bind(this);
    }
    componentDidMount() {
        const state = this;
        axios.get('api/getUserinfo', { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true })
            .then(function (response) {
                state.setState({
                    userInfo: response.data.userInfo,
                    usrOrder: response.data.orderinfoItems,
                    loading: false
                });
                console.log(state.state.usrOrder);
            });
    }
    showReport(id) {
        this.setState({
            idDHReport:id,
            showReport: true
        });
    }
    sendReport()
    {
        const state = this;
        const value = document.getElementsByClassName('report-Donhang')[0].value;
        const data = JSON.stringify({
            idDH: this.state.idDHReport,
            ReportInfo: value
        });
        axios.post('api/getReport', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true }).then((Response) => {
            window.alert("Chúng tôi đã nhận được báo cảo bạn về đơn hàng này!!!");
            state.setState({
                showReport: false
            });
        });
    }
    closeReport()
    {
        this.setState({
            showReport: false
        });
    }
    closeDetail() {
        this.setState({
            showDetailOrder: false
        });
    }
    showDetail(id) {
        const state = this;
        axios.get('api/orderDetail/' + id).then((Response) => {
            state.setState({
                orderDetail: Response.data,
                showDetailOrder: true
            });
        });
        console.log(id);
    }
    Showupdate() {
        this.setState({
            showUpdate: true
        });
    }
    updateTinhtrang(id)
    {
        axios.get('api/HoanTat/' + id).then((Response) => {
            window.location.reload();
        });
    }
    ShowPassUpdate() {
        this.setState({ showPass: true });
    }
    ShowUsr() {
        this.setState({
            updateUsr: true
        });
    }
    handleupdateClose() {
        this.setState({
            showUpdate: false,
            showPass: false,
            updateUsr: false
        });
    }
    updatePass() {
        //api / updatePass
        this.setState({ loading: true });
        const state = this;
        const passToUpdate = document.getElementsByClassName('lgInfo-pass')[0].value;
        if (!passToUpdate) {
            window.alert("Phần mật khẩu không để trống!!!");
            this.setState({
                loading: false
            });
        } else {
            const data = JSON.stringify({
                pass: passToUpdate,
                idKH: this.state.userInfo.idKh
            });
            axios.post('api/updatePass', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true }).then(function (response) {
                state.setState({
                    userInfo: response.data,
                    showPass: false,
                    loading: false
                });
            });
        }
    }
    updateInfo(lg) {
        const state = this;
        this.setState({ loading: true })
        if (lg) {
            const data = JSON.stringify({
                email: document.getElementsByClassName('MailKH')[0].value,
                tenKH: document.getElementsByClassName('TenKH')[0].value,
                sdt: document.getElementsByClassName('SdtKH')[0].value,
                diachi: document.getElementsByClassName('DcKH')[0].value,
                idKH: this.state.userInfo.idKh
            });
            axios.post('api/updateKHInfo', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true }).then(function (response) {
                state.setState({
                    userInfo: response.data,
                    showUpdate: false,
                    loading: false
                });
            });
            this.handleupdateClose();
        } else {
            const data = JSON.stringify({
                email: document.getElementsByClassName('lgInfo-email')[0].value,
                tenKH: document.getElementsByClassName('lgInfo-name')[0].value,
                idKH: this.state.userInfo.idKh
            });
            axios.post('api/updateInfo', data, { headers: { 'Content-Type': 'application/json', Authorization: AuthStr }, withCredentials: true }).then(function (response) {
                state.setState({
                    userInfo: response.data,
                    updateUsr: false,
                    loading: false
                });
            });
        }
    }
    convertDate(dateDB) {
        var date = new Date(Date.parse(dateDB));
        return date;
    }
    render() {

        let content = this.state.loading ? 'Loadingg' : <div className="container">
            <div className="row ">
                <div className="col-md-12">
                    <h4>Your Profile</h4>
                    <hr />
                </div>
            </div>
            <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#home">Thông tin cá nhân của bạn</a></li>
                <li><a data-toggle="tab" href="#menu1">Thông tin tài toản</a></li>
                <li><a data-toggle="tab" href="#menu2">Lịch sử mua hàng</a></li>
            </ul>

            <div className="tab-content " >
                <div id="home" className="tab-pane fade in active  col-md-offset-4">
                    <h4>Email của bạn: {this.state.userInfo.mail}</h4>
                    <h4>Họ và tên : {this.state.userInfo.tenKh}</h4>
                    <h4>Số điện thoại : {this.state.userInfo.sdt}</h4>
                    <h4>Địa chỉ : {this.state.userInfo.diachi}</h4>
                    <button className=" btn btn-default" type="button" onClick={this.Showupdate}>Chỉnh sửa thông tin cá nhân</button>

                </div>
                <div id="menu1" className="tab-pane fade col-md-offset-4">
                    <h4>Email của bạn:</h4>
                    <input className="lgInfo-email" type="email" defaultValue={this.state.userInfo.mail} />
                    <h4>Tên hiển thị:</h4>
                    <input className="lgInfo-name" type="name" defaultValue={this.state.userInfo.tenKh} /><br /><br />
                    <button className="btn btn-default" type="button" onClick={this.ShowUsr}>Cập nhật thông tin tài khoản</button>
                    <br /><br />
                    <Button bsStyle="primary" onClick={this.ShowPassUpdate} >CHỈNH SỬA MẬT KHẨU</Button>
                </div>
                <div id="menu2" className="tab-pane fade" >
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Các đơn hàng của bạn</h4>
                            <div className="table-responsive">
                                <table id="mytable" className="table table-bordred table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày Đặt</th>
                                            <th>Tổng Tiền</th>
                                            <th>Số sản phẩm</th>
                                            <th>Địa chỉ</th>
                                            <th>Tên người nhận</th>
                                            <th>Số điện thoại</th>
                                            <th>Lời nhắn của bạn</th>
                                        </tr>
                                    </thead>
                                    {this.state.usrOrder.map((order) =>
                                        <tbody key={order.idHd}>
                                            <tr>
                                                <td>{order.idHd}</td>
                                                <td>{this.convertDate(order.ngayLap).toLocaleDateString()}</td>
                                                <td>{formatter.format(order.tongGiaTri)}</td>
                                                <td>{"Có " + order.tongSlsp + " sản phẩm trong đơn "}</td>
                                                <td>{order.diaChi}</td>
                                                <td>{order.tenNguoiNhan}</td>
                                                <td>{order.sodienthoai}</td>
                                                <td>{order.ghiChu}</td>
                                                <td><Button bsSize="small" bsStyle="info" data-toggle="collapse" data-target={".order" + order.idHd} href="">Tình trạng đơn hàng</Button></td>
                                                <td><Button bsSize="small" bsStyle="info" onClick={() => { this.showDetail(order.idHd) }}>Chi Tiết</Button></td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                                <div className="clearfix"></div>
                                <div className="row shop-tracking-status">
                                    <div className="col-md-12">
                                        {this.state.usrOrder.map((order) =>
                                            <div className={"order-status collapse order" + order.idHd}>
                                                
                                                {order.tinhTrang === "Van chuyen" || order.tinhTrang === "Giao" || order.tinhTrang === "Hoan Tat" ? <div><Button bsStyle="info" disabled={order.tinhTrang === "Hoan Tat"} onClick={() => this.updateTinhtrang(order.idHd)}>Đã nhận được hàng </Button>
                                                    <br /><br /> <Button bsStyle="info" onClick={() => this.showReport(order.idHd)}>Đơn hàng có vấn đề ?</Button></div> : null}
                                                <br /><br />
                                                <br /><br />
                                                <br /><br />
                                                <hr/>
                                                <div className="order-status-timeline">
                                                    <div className={"order-status-timeline-completion " + getStatus(order.tinhTrang)}></div>
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
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Modal section*/}
            <Modal show={this.state.showUpdate} onHide={this.handleupdateClose}>
                <Modal.Header closeButton>
                    <Modal.Title>UPDATE THÔNG TIN</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h3> Họ và tên:</ h3>
                    <input className="TenKH" type="text" defaultValue={this.state.userInfo.tenKh} /> <br />
                    <h3>Email:</h3>
                    <input className="MailKH" type="text" defaultValue={this.state.userInfo.mail} /> <br />
                    <h3>Số điện thoại:</h3>
                    <input className="SdtKH" type="text" defaultValue={this.state.userInfo.sdt} /> <br />
                    <h3>Địa chỉ:</h3>
                    <input className="DcKH" type="text" defaultValue={this.state.userInfo.diachi} />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleupdateClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.updateInfo}>CẬP NHẬT THÔNG TIN</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.updateUsr} onHide={this.handleupdateClose}>
                <Modal.Header closeButton>
                    <Modal.Title>UPDATE THÔNG TIN</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h2>UPDATE THÔNG TIN TÀI KHOẢN CỦA BẠN ?</h2>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleupdateClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={() => this.updateInfo(false)}>CONFIRM</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.showPass} onHide={this.handleupdateClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Cập nhật mật khẩu</h4>
                    <input className="lgInfo-pass" type="password" defaultValue="" placeholder="Mật khẩu cho tài khoản của bạn" />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleupdateClose}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.updatePass}>CẬP NHẬT MẬT KHẨU</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.showReport} onHide={this.closeReport}>
                <Modal.Header closeButton>
                    <Modal.Title>REPORT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Chuyện gì đã xảy ra với đơn hàng của bạn ?</h4>
                    <input className="report-Donhang" type="text" defaultValue="" placeholder="" />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeReport}>Trở Về</Button>
                    <Button bsStyle="primary" onClick={this.sendReport}>Gửi</Button>
                </Modal.Footer>
            </Modal>


            <Modal bsSize="large" show={this.state.showDetailOrder} onHide={this.closeDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="mytable" className="table table-bordred table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng tiền </th>
                            </tr>
                        </thead>
                        {this.state.orderDetail.map((detail) =>
                            <Orderdetail orderDetail={detail} />
                            )}
                    </table>
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.closeDetail}>Trở Về</Button>
                </Modal.Footer>
            </Modal>

            {/*End Modal section*/}
        </div>;
        return (content);
    }
}

{/*UserProfile  section*/ }
