let React = require('react');
let NavigatorMixin = require('./Mixin');
let ClassNames = require( 'classnames' );

require( './style.scss' );

let NavigatorCompItem = React.createClass({

    click: function(){
        if(this.props.item.clickable && this.props.onClick ){
            this.props.onClick(this.props.item);
        }
    },

    render: function(){
        let itemWidth =  100/(this.props.total-1);
        let lastOne = this.props.item.order==this.props.total-1;
        let leftValue;

        if(this.props.item.order==1){
            leftValue = (itemWidth*this.props.item.order-5) +'%';
        }else if(this.props.item.order==2){
            leftValue = (itemWidth*this.props.item.order-4) +'%';
        }else if(this.props.item.order==3){
            leftValue = (itemWidth*this.props.item.order-2) +'%';
        }else{
            leftValue = itemWidth*this.props.item.order +'%';
        }
        let middleOne = !(this.props.item.order==this.props.total-1 || this.props.item.order==0);

        if(middleOne){
            return <span className={ClassNames({navItemWrapper:true, last: lastOne, clickable: this.props.item.clickable, center: middleOne})}
                onClick={this.click}
                style={{left: leftValue}}
                >
                    <span className={ClassNames({navItemCircle:true, navItemCircleActive: this.props.item.active, navItemCircleCurrentActive: this.props.item.current })}>
                        <span className="innerNumber">{this.props.item.order+1}</span>
                    </span>
                    <br/>
                    <span className={ClassNames({navItemTitle:true, navItemTitleActive: this.props.item.active, navItemTitleCurrentActive: this.props.item.current })}>{this.props.item.title}</span>
                </span>
            }else{
                return <span className={ClassNames({navItemWrapper:true, last: lastOne, clickable: this.props.item.clickable, center: middleOne})}
                    onClick={this.click}
                    >
                        <span className={ClassNames({navItemCircle:true, navItemCircleActive: this.props.item.active, navItemCircleCurrentActive: this.props.item.current })}>
                            <span className="innerNumber">{this.props.item.order+1}</span>
                        </span>
                        <br/>
                        <span className={ClassNames({navItemTitle:true, navItemTitleActive: this.props.item.active, navItemTitleCurrentActive: this.props.item.current  })}>{this.props.item.title}</span>
                    </span>
                }

            }
        });

        let NavigatorComp = React.createClass({
            mixins: [NavigatorMixin],
            render: function(){
                let totalItems = this.state.items.length;
                var _this = this;
                return <div className="navWrapper">
                    <hr className="navHRLine" />
                    <div className="navBody">
                        <div className="navContentHolder">
                            {this.state.items.map(function(item, index){
                                return <NavigatorCompItem
                                    key={item.order}
                                    total={totalItems}
                                    item={item}
                                    onClick={_this.clickHandler}
                                />
                            })}
                        </div>
                    </div>
                </div>
            }
        });
        module.exports = NavigatorComp;
