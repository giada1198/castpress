import React, { Component } from 'react';
import * as rssParser from 'react-native-rss-parser';
import Intro from './components/intro/Intro';
import Player from './components/player/Player';

// import './App.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rss: {},
			database: {}
		};
	}

	fetchRSSFeeds = (url) => {
		let promise = fetch(url)
			.then((response) => response.text())
			.then((responseData) => rssParser.parse(responseData))
			.then((rss) => {
				// map useful data from the feeds
				let items = rss.items.map((item) => {
					return {
						id: item.id,
						title: item.title,
						description: item.description,
						soundURL: item.enclosures[0].url,
						soundFormat: item.enclosures[0].mimeType,
						published: new Date(item.published)
					};
				})
				// sort episodes by published date
				items.sort((a, b) => {
					if(a.published > b.published) return -1;
					else if(a.published < b.published) return 1;
					return 0;
				});
				// save to state
				this.setState({
					rss: {
						title: rss.title,
						overview: {
							primary: rss.description
						},
						episodes: items
					}
				});
				console.log(this.state.rss);
			});
		return promise;
	}

	fetchFirebaseData = (url) => {
		let promise = fetch(url)
			.then((response) => response.json())
			.then((data) => {
				let database = JSON.parse(JSON.stringify(data));
				this.setState({ database: database });
				console.log(this.state.database);
			})
			.catch((error) => {
				// renderError(error);
			})
		return promise;
	}

	componentDidMount() {
		this.fetchRSSFeeds('rss.xml');
		this.fetchFirebaseData('firebase.json');
		console.log(this.state.rss);
	}

	render() {
		if(!this.state.rss.title) return null;
		let title = !this.state.database.title ? this.state.database.title : this.state.rss.title;
		return (
			<div>
				<Header title={title} />
				<main>
					<Content />
				</main>
				<footer>
					<Player />
				</footer>
			</div>
		);
	}

}

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

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
							<h1>{this.props.title}</h1>
							<button className="login" onClick={this.handleSignUp}>Login</button>
						</div>
					</section>
					<form className="search-container-top">
						<input type="text" id="search-bar-desktop" placeholder="Episodes, Contents, Published Dates" />
						<i className="search-icon-top fa fa-search fa-1point5x" aria-hidden="true"></i>
					</form>
				</div>
			</header>
		);
	}
}

class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<main>
				<Intro />
			</main>
		);
	}
}