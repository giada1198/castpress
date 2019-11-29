import React, { Component } from 'react';

// import './Player.css';

export default class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

    render() {
        return (
            <section className="player">
                <div className="container grid">
                    <div className="now-playing-info-desktop"></div>
                    <div className="player-interface">
                        <a href="#" className="step-backward-button"><i className="fa fa-step-backward"></i></a>
                        <a className="play-button"><i className="fa fa-play"></i></a>
                        <a href="#" className="forward-button"><i className="fa fa-forward"></i></a>
                        <a href="#" className="step-forward-button"><i className="fa fa-step-forward"></i></a>
                        <div className="now-playing">
                            <div className="now-playing-info-mobile"></div>
                            <div className="progress-bar">
                                <div className="current-time">0:00</div>
                                <div className="bar"></div>
                                <div className="end-time">3:05</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}