import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { storage } from "../base";

function Getname(props) {
    if (props.small === 'true')
        return <Link className='' to={"/DetailsanPham/" + props.SP.id}><h4>{props.SP.name}</h4></Link>;
    return <Link className='' to={"/DetailsanPham/" + props.SP.id}><h2>{props.SP.name}</h2></Link>;
}
export default class ProductText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.SP.id,
            img: null
        };
        storage.child(this.props.SP.img).getDownloadURL().then((url) => {
            this.setState({
                img: url,
            });
            console.log(this.state.anhSP);
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        let id = this.state.id;
        let state = this;
        return (<div className="productinfo text-center">
            <img src={this.state.img} alt="" />
            <Getname small={this.props.small} SP={this.props.SP} />
            {/*  {}<a href="javascript:void(0)" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>Add to cart</a>*/}
            <button onClick={function (e) {
                state.props.addtoCart(id); //can pass arguments this.btnTapped(foo, bar);          
            }} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>Thêm vào giỏ</button>
        </div>);
    }
}