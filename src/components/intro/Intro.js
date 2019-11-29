import React, { Component } from 'react';

export default class Intro extends Component {
	constructor(props) {
		super(props);
		this.state = {
            items: ['overview', 'hosts'],
            activeItem: 'overview'
        };
	}

    handleChange = (item) => {
        this.setState({ activeItem: item });
    }

    render() {
        let indicators = this.state.items.map((item) => {
            let isActive = (item === this.state.activeItem);
            return (
                <Indicator key={item} to={item} isActive={isActive} handleChange={this.handleChange} />
            )
        });

        let op = [];
        if(this.state.activeItem === 'overview') {
            op = [(<Overview />)];
        }
        else if(this.state.activeItem === 'hosts') {
            op = [(<Hosts />)];
        }
        
        return (
            <div className="container grid">
                <section className="content">
                    <div className="indicators">
                        {indicators}
                        {op}
                    </div>
                    <i className="spinner-inactive fa fa-spinner fa-spin" aria-hidden="true"></i>
                    <div className="overview-editable"></div>
                </section>
            </div>
        );
    }
}

class Indicator extends Component {
    constructor(props) {
		super(props);
		this.state = {};
    }

    clickIndicator = () => {
        this.props.handleChange(this.props.to);
    }

    render() {
        if(this.props.isActive) {
            return (
                <span className="indicator active" onClick={this.clickIndicator}/>
            )
        }
        else {
            return (
                <span className="indicator" onClick={this.clickIndicator}/>
            )
        }
    }
}

class Overview extends Component {
    constructor(props) {
		super(props);
		this.state = {};
    }
    
    render() {
        return (
            <p>this is overview</p>
        );
    }
}

class Hosts extends Component {
    constructor(props) {
		super(props);
		this.state = {};
    }
    
    render() {
        return (
            <p>this is hosts</p>
        );
    }
}