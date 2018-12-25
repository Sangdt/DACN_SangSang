import shipping from '../../images/home/shipping.jpg';
import 'rc-slider/assets/index.css';
import { Link} from 'react-router-dom';
import React from 'react';
import Tooltip from 'rc-tooltip';
/* slider plugin của react
 * src :https://www.npmjs.com/package/rc-slider
 * */
import Slider from 'rc-slider';
{/* Khai báo để slider chạy */ }
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;
const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};


export default class Sidebar extends React.Component{
    constructor() {
        super();
    }
    render() {
        return <div className="left-sidebar">
            <h2>Category</h2>
            <ProductCategory />
            <ProductCateUnder  />
        </div>;
    }
}
class ProductCategory extends React.Component {
    constructor() {
        super();
        this.state = { DmList: []};
        fetch('api/Danhmucs')
            .then(response => response.json())
            .then(data => {
                this.setState({ DmList: data });
            });

    }
   
    render() {
        return <div className="panel-group category-products" id="accordian">
            {/*Ẩm thực*/}
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#food">
                            <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                            Ẩm Thực
					</a>
                    </h4>
                </div>
                <div id="food" className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul>
                            {this.state.DmList.map((dml) => {
                                if (dml.idDml === 1)
                                    return <li key={dml.idDm}>
                                        <Link  className='' to={'/Danhmuc/' +dml.tenDanhmuc+'/'+dml.idDm}>{dml.tenDanhmuc}</Link>
                                         </li>;
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/*Du lịch*/}
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#travel">
                            <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                            Du lịch
					</a>
                    </h4>
                </div>
                <div id="travel" className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul>
                            {this.state.DmList.map((dml) => {
                                if (dml.idDml === 2)
                                    return <li key={dml.idDm }>
                                        <Link className='' to={'/Danhmuc/' + dml.tenDanhmuc + '/' + dml.idDm}>{dml.tenDanhmuc}</Link>
                                    </li>;
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/*Spa & Làm đẹp*/}
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#beauty">
                            <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                            Spa & Làm đẹp
					</a>
                    </h4>
                </div>
                <div id="beauty" className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul>
                            {this.state.DmList.map((dml) => {
                                if (dml.idDml === 3)
                                    return <li key={dml.idDm }>
                                        <Link  className='' to={'/Danhmuc/' + dml.tenDanhmuc + '/' + dml.idDm}>{dml.tenDanhmuc}</Link>
                                    </li>;
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/*Giải trí*/}
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#entertain">
                            <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                            Giải trí
					</a>
                    </h4>
                </div>
                <div id="entertain" className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul>
                            {this.state.DmList.map((dml) => {
                                if (dml.idDml === 4)
                                    return <li key={dml.idDm}>
                                        <Link className='' to={'/Danhmuc/' + dml.tenDanhmuc + '/' + dml.idDm}>{dml.tenDanhmuc}</Link>
                                    </li>;
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/*Thời trang*/}
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#fashion">
                            <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                            Thời trang
					</a>
                    </h4>
                </div>
                <div id="fashion" className="panel-collapse collapse">
                    <div className="panel-body">
                        <ul>
                            {this.state.DmList.map((dml) => {
                                if (dml.idDml === 5)
                                    return <li key={dml.idDm}>
                                        <Link  className='' to={'/Danhmuc/' + dml.tenDanhmuc + '/' + dml.idDm}>{dml.tenDanhmuc}</Link>
                                    </li>;
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    }
}
/**
 * slider giá
 */

function ProductCateUnder(props) {
    return <div>
        <div className="price-range">
            <h2>Price Range</h2>
            <div className="well text-center">
                {/*Slider*/}
                <Range min={0} max={20} defaultValue={[3, 10]} tipFormatter={value => `${value}`} />
            </div>
        </div>
        <div className="shipping text-center">
            <img src={shipping} alt="" />
        </div>
    </div>
        ;

}