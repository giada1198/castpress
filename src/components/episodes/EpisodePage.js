import React, { Component } from 'react';
import firebase from 'firebase/app';
import parse from 'html-react-parser';
import moment from 'moment';
import './EpisodePage.css';

export default class EpisodePage extends Component {
	constructor(props) {
		super(props);
        this.state = {
            episode: undefined
        };
    }

	componentDidMount() {
        let episodeId = this.props.match.params.episodeId;
        this.setState({ episode: this.props.episodes[episodeId] });
        let path = 'data/data/episodes/' + episodeId
        this.dataRef = firebase.database().ref(path);
        this.dataRef.on('value', (snapshot) => {
            let firebaseData = snapshot.val();
            if(!(this.state.episode === undefined)) {
                this.setState({ episode: firebaseData });
            }
        });
    }
    
    componentWillUnmount() {
		this.dataRef.off();
	}

    changeEpisode = () => {
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
        let index = episodes.indexOf(this.state.episode);
        this.props.changeEpisode(index);
    }

    callWindow = () => {
        this.setState({ isClicked: true });
        this.props.callWindow('episode', this.state.episode.id);
    }

    render() {
        if(this.state.episode === undefined) return null;

        let description = this.state.episode.description.startsWith('<') ?
            parse(this.state.episode.description) :
            (<p>{this.state.episode.description}</p>);

        let editButtons = this.props.user ? (
            <div className="edit-buttons">
                <button>
                    <img src="../../img/icons/edit-text.svg"
                        alt="edit the episode description"
                        onClick={this.callWindow} />
                </button>
            </div>
            ) : null;

        let date = moment(this.state.episode.published).format('MMM D, YYYY');
        let style = { backgroundImage: 'url(' + this.state.episode.cover + ')' };

        return (
            <div className="container">
                <div className="episode-page">
                    {editButtons}
                    <div className="episode-cover" style={style} onClick={this.changeEpisode}>
                            <div className="play-icon">
                                <i className="fa fa-play"></i>
                        </div>
                    </div>
                    <div className="episode-description">
                        <h3>{date}</h3>
                        <h4>{this.state.episode.title}</h4>
                        {description}
                    </div>
                </div>
            </div>
        );
    }
}