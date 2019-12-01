import React, { Component } from 'react';
import moment from 'moment';
import './Episodes.css';

export default class Episodes extends Component {
	constructor(props) {
		super(props);
        this.state = {};
    }

    render() {        
        let episodes = this.props.episodes.map((episode, index) => {
            return <Episode key={episode.id} episode={episode} index={index} changeEpisode={this.props.changeEpisode} />
        });
        return (
            <div className="container">
                <section className="episodes">
                    {episodes}
                </section>
            </div>
        );
    }
}

class Episode extends Component {
    changeEpisode = () => {
        this.props.changeEpisode(this.props.index);
    }

    render() {
        
        let date = moment(this.props.episode.published).format('MMM D, YYYY');
        let style = {
            backgroundImage: 'url(' + this.props.episode.cover + ')'
        };
        return (
            <div className="episode" onClick={this.changeEpisode}>
                <div className="episode-cover" style={style}></div>
                <div className="episode-description">
                    <h3>{date}</h3>
                    <h4>{this.props.episode.title}</h4>
                </div>
            </div>
        );
    }
}