import React from 'react';
import { Link} from 'react-router-dom';
import Countdown from 'react-countdown-now';
import ProductText from './ProductText';
{/*Custom countdown*/ }


function SetRender(start) {
    if (start) {
        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                // Render a completed state
                return <h3>Hết Hạn</h3>;
            } else if (days > 0) {
                // Render a countdown
                return <h2>Còn {days} ngày và {hours}:{minutes}:{seconds}</h2>;
            } else {
                return <h2>Hết hạn trong:{hours}:{minutes}:{seconds}</h2>;
            }
        };
        return renderer;
    } else {
        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                // Render a completed state
                return <h3>Đã bắt đầu</h3>;
            } else {
                return <h2>Bắt đầu trong {days} ngày {hours}:{minutes}:{seconds}</h2>;
            }
        };
        return renderer;
    }
}

export default class ProductWrapper extends React.Component{
    constructor() {
        super();
        this.submitHandler = this.submitHandler.bind(this);
    }
    submitHandler()
    {
        this.props.addtoCart(this.props.SP.id);
    }

    render() {
        return (
            <div className="col-sm-4">
                <div className="product-image-wrapper">
                        <div className="single-products">
                        <ProductText addtoCart={this.submitHandler} SP={this.props.SP} />
                        <div className="product-overlay">
                            <div className="overlay-content">
                                <Countdown date={new Date(this.props.SP.endDate.toString()).getTime()} renderer={SetRender(this.props.SP.Sdate)} />
                                <br />
                                <Link className='' to={"/DetailsanPham/" + this.props.SP.id}><h3>{this.props.SP.name}</h3></Link>
                                <button onClick={this.submitHandler} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>Thêm vào giỏ</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div >);
    }
};
