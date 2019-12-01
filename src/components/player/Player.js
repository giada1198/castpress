import React, { Component } from 'react';
import './Player.css';

export default class Player extends Component {
	constructor(props) {
		super(props);
        this.state = {
            playStatus: 'play',
            duration: 0,
            currentTime: 0,
            currentPercent: 0
        };
    }

    componentDidMount() {
        this.audio.addEventListener('timeupdate', (event) => {
            let percent = (!isNaN(event.target.currentTime/event.target.duration)) ? (event.target.currentTime/event.target.duration)*100 : 0;
            this.setState({
                duration: Math.floor(event.target.duration),
                currentTime: Math.floor(event.target.currentTime),
                currentPercent: percent
            });
            if(event.target.currentTime >= event.target.duration && this.state.playStatus === 'pause') {
                this.stepForward();
            }
        });
    }
    
    componentWillUnmount() {
        this.audio.removeEventListener('timeupdate', () => {});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.nowPlaying !== this.props.nowPlaying) {
            if(this.state.playStatus === 'pause') {
                this.audio.play();
            } else {
                this.play();
            }
        }
        if(prevState.playStatus === 'play' && this.state.playStatus === 'pause') this.audio.play();
        else if(prevState.playStatus === 'pause' && this.state.playStatus === 'play') this.audio.pause();
    }

    stepForward = () => {
        let ep = (this.props.nowPlaying + 1) % this.props.episodeAmount;
        this.props.changeEpisode(ep);
    }

    stepBackward = () => {
        let ep = (this.props.nowPlaying - 1 + this.props.episodeAmount) % this.props.episodeAmount;
        this.props.changeEpisode(ep);
    }

    play = () => {
        let status = this.state.playStatus;
		(status === 'play') ? status = 'pause' : status = 'play';
		this.setState({ playStatus: status });
    }

    playForward = () => {
        this.audio.currentTime += 15;
    }

    playBackward = () => {
        this.audio.currentTime -= 15;
    }

	updateTime = (timestamp) => {
		timestamp = Math.floor(timestamp);
		this.setState({ currentTime: timestamp });
    }

    render() {
        if(!this.props.episodes[this.props.nowPlaying]) return null;
        
        let playIcon = (this.state.playStatus === 'play') ? (<i className="fa fa-play"></i>) : (<i className="fa fa-pause"></i>)
        return (
            <section className="player">
                <audio src={this.props.episodes[this.props.nowPlaying].soundURL} ref={(audio) => { 
                    this.audio = audio;
                    }} />
                <div className="container grid">
                    <TrackInfoDesktop track={this.props.episodes[this.props.nowPlaying]} />
                    <div className="player-interface">
                        <button className="step-backward-bt" onClick={this.stepBackward}>
                            <i className="fa fa-step-backward"></i>
                        </button>
                        <button className="forward-bt" onClick={this.playBackward}>
                            <i className="fa fa-backward"></i>
                        </button>
                        <button className="play-bt" onClick={this.play}>
                            {playIcon}
                        </button>
                        <button className="forward-bt" onClick={this.playForward}>
                            <i className="fa fa-forward"></i>
                        </button>
                        <button className="step-forward-bt" onClick={this.stepForward}>
                            <i className="fa fa-step-forward"></i>
                        </button>
                        <div className="now-playing">
                            <TrackInfoMobile track={this.props.episodes[this.props.nowPlaying]} />
                            <ProgressBar duration={this.props.episodes[this.props.nowPlaying].duration} currentTime={this.state.currentTime} currentPercent={this.state.currentPercent} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

class TrackInfoDesktop extends Component {
    render() {
        let style = {
            backgroundImage: 'url(' + this.props.track.cover + ')'
        };
        return (
            <div className="track-info-desktop">
                <span className="track-artwork" style={style}></span>
                <div>
                    <div className="ep"></div>
                    <div className="title">{this.props.track.title}</div>
                </div>
            </div>
        )
    }
}

class TrackInfoMobile extends Component {
    render() {
        return (
            <div className="track-info-mobile">
                <div className="title">{this.props.track.title}</div>
            </div>
        )
    }
}

class ProgressBar extends Component {
	convertTime = (timestamp) => {
		let minutes = Math.floor(timestamp / 60);
		let seconds = timestamp - (minutes * 60);
		if(seconds < 10) {
			seconds = '0' + seconds;
		}
		timestamp = minutes + ':' + seconds;
		return timestamp;
    }
    
    render() {
        return (
            <div className="progress-bar">
                <div className="current-time">{this.convertTime(this.props.currentTime)}</div>
                <progress className="bar" min="0" max="100" value={this.props.currentPercent}></progress>
                <div className="end-time">{this.convertTime(this.props.duration)}</div>
            </div>
        )
    }
}