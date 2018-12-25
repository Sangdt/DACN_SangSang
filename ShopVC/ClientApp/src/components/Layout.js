import React, { Component } from 'react';
import ScrollToTop from 'react-scroll-up';
import Header from './Layout/Header';
import { withRouter } from 'react-router-dom';
import Footer from './Layout/footer';
const styleScroll = { position: 'fixed', 'zIndex': 2147483647};
export class Layout extends Component {
  displayName = Layout.name
    render() {
        return <div className='appContent'>
            <Header logOut={this.props.logOut} emailSignup={this.props.emailSignup} closeSUconfirm={this.props.closeSUconfirm} signupConfirm={this.props.signupConfirm} showModal={this.props.showModal} showLGmodal={this.props.showLGmodal} closeError={this.props.closeError} error={this.props.error} showError={this.props.showError} loginState={this.props.loginState} usrName={this.props.usrName} fbLogin={this.props.fbLogin} emailLogin={this.props.emailLogin} />
            {this.props.children}
            <ScrollToTop showUnder={20} duration={500} easing="easeOutCubic" topPosition={0}>
                <a id="scrollUp" style={styleScroll}>
                    <i className="fa fa-angle-up"></i>
                </a>
            </ScrollToTop>
            <Footer />
        </div>;
    }
}
 //withRouter(Layout); 