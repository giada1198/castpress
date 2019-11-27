import React, { Component } from 'react';
// import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	fetchDatabase = (url) => {
		// togglerSpinner();
		// let promise = fetch(url)
		// 	.then((response) => {
		// 		return response.json();
		// 	})
		// 	.then((data) => {
		// 		database = JSON.parse(JSON.stringify(data));
	
		// 		// sort episodes from latest to oldest
		// 		database.episodes.sort((episode1, episode2) => episode2.episode - episode1.episode);
	
		// 		// render each section
		// 		renderHeader(database);
		// 		renderContent(database);
		// 		renderEpisodes(database);
		// 		renderNowPlaying(database);
	
		// 	})
		// 	.catch((error) => {
		// 		renderError(error);
		// 	})
		// 	.then(togglerSpinner);
		// return promise;
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<Header name="xxx" />
		);
	}

}

class Header extends Component {

	handleSignUp = () => {

	}

	render() {
		return (
			<header>
				<span className="deco-bar"></span>
				<div className="header-container">
					<section className="name">
						<span className="dot"></span>
						<div className="header-texts">
							<h1>{this.props.name}</h1>
							<button className="login" onClick={this.handleSignUp}>Login</button>
						</div>
					</section>
					<form className="search-container-top">
						<input type="text" id="search-bar-desktop" placeholder="Episodes, Contents, Published Dates" />
						<a href="#"><i className="search-icon-top fa fa-search fa-1point5x" aria-hidden="true"></i></a>
					</form>
				</div>
			</header>
		);
	}
}

export default App;