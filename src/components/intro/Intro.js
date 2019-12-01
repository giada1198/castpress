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

        let content = (this.state.activeItem === 'overview') ? (<Overview overview={this.props.data.overview} links={this.props.data.links} />) : (this.state.activeItem === 'hosts') ? (<Hosts hosts={this.props.data.hosts} />) : null;

        return (
            <div className="container grid">
                <section className="content">
                    <div className="indicators">
                        {indicators}
                    </div>
                    <i className="spinner-inactive fa fa-spinner fa-spin" aria-hidden="true"></i>
                    {content}
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
        if (this.props.isActive) {
            return (
                <span className="indicator active" onClick={this.clickIndicator} />
            )
        }
        else {
            return (
                <span className="indicator" onClick={this.clickIndicator} />
            )
        }
    }
}

class Overview extends Component {

    render() {
        let links = ['apple-podcasts', 'spotify', 'google-podcasts'].map((platform) => {
            if(!(!this.props.links[platform] || this.props.links[platform] === '')) {
                if(platform === 'apple-podcasts') {
                    return (
                        <a key={platform} className="link" title="Apple Podcasts" href={this.props.links[platform]} target="_blank" rel="noopener noreferrer" aria-label="Go to the podcast page on Apple Podcasts">
                            <i className="fa fa-podcast" aria-hidden="true"></i>
                        </a>
                    )
                }
                else if(platform === 'spotify') {
                    return (
                        <a key={platform} className="link" title="Spotify" href={this.props.links[platform]} target="_blank" rel="noopener noreferrer" aria-label="Go to the podcast page on Spotify">
                            <i className="fa fa-spotify" aria-hidden="true"></i>
                        </a>
                    )
                }
                else if(platform === 'google-podcasts') {
                    return (
                        <a key={platform} className="link" title="Google Podcasts" href={this.props.links[platform]} target="_blank" rel="noopener noreferrer" aria-label="Go to the podcast page on Google Podcasts">
                            <i className="fa fa-android" aria-hidden="true"></i>
                        </a>
                    ) 
                }
            };
            return null;
        });

        return (
            <div className="overview-editable">
                <h2>{this.props.overview.primary}</h2>
                <p>{this.props.overview.secondary}</p>
                <div className="links">
                    {links}
                </div>
            </div>
        );
    }
}

class Hosts extends Component {

    render() {
        let hostKeys = Object.keys(this.props.hosts)
        let hosts = hostKeys.map((key) => {
            let style = {
                backgroundImage: 'url(' + this.props.hosts[key].photo + ')'
            };
            return (
                <div key={this.props.hosts[key].name} className="host introduction">
                    <div className="photo" style={style} />
                    <div>
                        <h3>{this.props.hosts[key].name}</h3>
                        <p>{this.props.hosts[key].description}</p>
                    </div>
                </div>
            );
        });
        return (
            <div className="overview-editable">
                {hosts}
            </div>
        );
    }
}