import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import './Episodes.css';

export default class Episodes extends Component {
	constructor(props) {
		super(props);
        this.state = {};
    }

    render() {
        let episodeKeys = Object.keys(this.props.episodes);
        let episodes = episodeKeys.map((key) => {
            return this.props.episodes[key];
        });
        // sort episodes by published date
        episodes.sort((a, b) => {
            let da = new Date(a.published);
            let db = new Date(b.published);
            if(da > db) return -1;
            else if(da < db) return 1;
            return 0;
        });
        let renderedEpisodes = episodes.map((episode, index) => {
            return <Episode key={episode.id}
                user={this.props.user}
                episode={episode}
                index={index}
                changeEpisode={this.props.changeEpisode}
                callWindow={this.props.callWindow} />
        });
        return (
            <div className="container">
                <section className="episodes">
                    {renderedEpisodes}
                </section>
            </div>
        );
    }
}

class Episode extends Component {
	constructor(props) {
		super(props);
        this.state = { shouldRedirect: false };
    }

    handleClick = () => {
        this.setState({ shouldRedirect: true });
    }

    changeEpisode = () => {
        this.props.changeEpisode(this.props.index);
    }

    callWindow = () => {
        this.setState({ isClicked: true });
        this.props.callWindow('episode', this.props.episode.id);
    }

    render() {
        if(this.state.shouldRedirect) {
			return <Redirect push to={'/episode/' + this.props.episode.id} />
		}
        
        let date = moment(this.props.episode.published).format('MMM D, YYYY');
        let style = { backgroundImage: 'url(' + this.props.episode.cover + ')' };

        // let editButtons = this.props.user ? (
        //     <div className="edit-buttons">
        //         <button>
        //             <img src="img/icons/edit-text.svg"
        //                 alt="edit the episode description"
        //                 onClick={this.callWindow} />
        //         </button>
        //     </div>
        //     ) : null;

        return (
            <div className="episode" >
                {/* {editButtons} */}
                <div className="episode-cover" style={style} onClick={this.changeEpisode}>
                    <div className="play-icon">
                        <i className="fa fa-play"></i>
                    </div>
                </div>
                <div className="episode-description" onClick={this.handleClick} >
                    <h3>{date}</h3>
                    <h4>{this.props.episode.title}</h4>
                </div>
            </div>
        );
    }
}