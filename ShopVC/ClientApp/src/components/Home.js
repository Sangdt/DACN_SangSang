import React, { Component } from 'react';
import pricing from '../images/home/pricing.png';
import girl1 from '../images/home/girl1.jpg';
import girl2 from '../images/home/girl2.jpg';
import girl3 from '../images/home/girl3.jpg';
import SideBar from './Layout/SideMenu';
import ProductHome from './Layout/Product';
import ProductDetail from './ProductDetail';
import axios from 'axios';
import 'isomorphic-fetch';
{/*Slider hình */ }
function SliderHome() {
    let show = <section id="slider" >
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <div id="slider-carousel" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#slider-carousel" data-slide-to="0" className="active"></li>
                            <li data-target="#slider-carousel" data-slide-to="1"></li>
                            <li data-target="#slider-carousel" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner">
                            <div className="item active">
                                <div className="col-sm-6">
                                    <h1><span>E</span>-SHOPPER</h1>
                                    <h2>Free E-Commerce Template</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                    <button type="button" className="btn btn-default get">Get it now</button>
                                </div>
                                <div className="col-sm-6">
                                    <img src={girl1} className="girl img-responsive" alt="" />
                                    <img src={pricing} className="pricing" alt="" />
                                </div>
                            </div>
                            <div className="item">
                                <div className="col-sm-6">
                                    <h1><span>E</span>-SHOPPER</h1>
                                    <h2>100% Responsive Design</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                    <button type="button" className="btn btn-default get">Get it now</button>
                                </div>
                                <div className="col-sm-6">
                                    <img src={girl2} className="girl img-responsive" alt="" />
                                    <img src={pricing} className="pricing" alt="" />
                                </div>
                            </div>

                            <div className="item">
                                <div className="col-sm-6">
                                    <h1><span>E</span>-SHOPPER</h1>
                                    <h2>Free Ecommerce Template</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                    <button type="button" className="btn btn-default get">Get it now</button>
                                </div>
                                <div className="col-sm-6">
                                    <img src={girl3} className="girl img-responsive" alt="" />
                                    <img src={pricing} className="pricing" alt="" />
                                </div>
                            </div>

                        </div>

                        <a href="#slider-carousel" className="left control-carousel hidden-xs" data-slide="prev">
                            <i className="fa fa-angle-left"></i>
                        </a>
                        <a href="#slider-carousel" className="right control-carousel hidden-xs" data-slide="next">
                            <i className="fa fa-angle-right"></i>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </section >;
    return show;
}
function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
export class Home extends Component {
    displayName = Home.name
    constructor(props) {
        super(props);
        this.state = {
            SPlist: [],
            product: null,
            singlePro: false,
            fromDM: false,
            id: null,
            show: false

        };
        const state = this;
        if (this.props.location.pathname === '/') {
            fetch('api/SanPham')
                .then(response => response.json())
                .then(data => {
                    const shuffleData = shuffleArray(data);
                    this.setState({ SPlist: shuffleData });
                });
        } else if (window.location.pathname.indexOf('Danhmuc') > 0) {
            axios.get('api/SanPham/danhmuc/' + this.props.match.params.id).then(function (response) {
                state.setState({ SPlist: response.data, product: null, singlePro: false, fromDM: true });
                console.log(response);
            });
        } else if (window.location.pathname.indexOf('DetailsanPham') > 0 ) {
            axios.get('api/SanPham/deatail/' + this.props.match.params.idSp).then(function (response) {
                state.setState({
                    product: response.data,
                    singlePro: true,
                    fromDM: false
                });
                console.log(response);
            });
        }
    }

    componentDidUpdate() {
        const state = this;
        if (this.props.location.pathname === '/' && (this.state.fromDM || this.state.singlePro)) {
            axios.get('api/SanPham').then(function (response) {
                state.setState({ SPlist: response.data, product: null, singlePro: false, fromDM: false });
            });
        }
    }

    componentWillReceiveProps(newProps) {
        const state = this;
        if (newProps.match.params.idSp ) {
            axios.get('api/SanPham/deatail/' + newProps.match.params.idSp).then(function (response) {
                state.setState({
                    product: response.data,
                    singlePro: true,
                    fromDM: false
                });
                console.log(response);
            });
        }
        if (newProps.match.params.id ) {
            axios.get('api/SanPham/danhmuc/' + newProps.match.params.id).then(function (response) {
                state.setState({ SPlist: response.data, product: null, singlePro: false, fromDM: true });
                console.log(response);
            });
        }

    }

    
   
    render() {
        let spContents = this.state.singlePro ? <ProductDetail product={this.state.product} /> : < ProductHome SPlist={this.state.SPlist} />

        return (<div>
            {
                this.state.singlePro ? null : <SliderHome />
            }
           
            <div className="container">
                <div className="row">
                    <div className='col-sm-3'>
                        <SideBar />
                    </div>
                    {/*Load san pham sectionnn*/}
                    {spContents}
                </div>
            </div>
        </div>
        );
    }
}
