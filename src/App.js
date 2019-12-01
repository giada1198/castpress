import React, { Component } from 'react';
import * as rssParser from 'react-native-rss-parser';
import Modal from './components/modal/Modal';
import Intro from './components/intro/Intro';
import Episodes from './components/episodes/Episodes';
import Player from './components/player/Player';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changedBackgroundColor: false,
			modalStatus: 'none',
			nowPlaying: 0,
			autoPlay: false,
			episodeAmount: 0
		};
	}

	changeEpisode = (ep) => {
		this.setState({ 
			nowPlaying: ep
		});
	};

	callModalWindow = (status) => {
		this.setState({ 
			modalStatus: status
		});
	}

	closeModalWindow = () => {
		this.setState({ 
			modalStatus: 'none'
		});
	}

	updateData = (updatedData) => {
		this.setState({
			data: updatedData
		});
	}

	fetchRSSFeeds = (url) => {
		let promise = fetch(url)
			.then((response) => response.text())
			.then((responseData) => rssParser.parse(responseData))
			.then((rss) => {
				// map useful data from the feeds
				let items = {};
				rss.items.forEach((item) => {
					items[item.id] = {
						id: item.id,
						title: item.title,
						description: item.description,
						cover: rss.image.url,
						soundURL: item.enclosures[0].url,
						soundFormat: item.enclosures[0].mimeType,
						duration: item.itunes.duration,
						published: new Date(item.published)
					};
				});
				// save to state
				this.setState({
					rss: {
						title: rss.title,
						cover: rss.image.url,
						overview: {
							primary: rss.description, 
							secondary: 'none'
						},
						episodes: items
					}
				});
				this.fetchFirebaseData('firebase.json');
			});
		return promise;
	}

	fetchFirebaseData = (url) => {
		let promise = fetch(url)
			.then((response) => response.json())
			.then((data) => {
				let database = JSON.parse(JSON.stringify(data));
				let sortedData = {};
				['title', 'cover', 'overview', 'links', 'hosts'].forEach((key) => {
					if(!database[key]) sortedData[key] = this.state.rss[key];
					else sortedData[key] = database[key];
				});
				let episodeKeys = Object.keys(this.state.rss.episodes);
				let episodes = episodeKeys.map((key) => {
					if(!database.episodes[key]) return this.state.rss.episodes[key];
					else return database.episodes[key];
				});
				// sort episodes by published date
				episodes.sort((a, b) => {
					if(a.published > b.published) return -1;
					else if(a.published < b.published) return 1;
					return 0;
				});
				sortedData.episodes = episodes;
				this.setState({
					data: sortedData,
					episodeAmount: sortedData.episodes.length
				});
			})
			.catch((error) => {
				// renderError(error);
			})
		return promise;
	}

	componentDidMount() {
		this.fetchRSSFeeds('rss.xml');
		window.addEventListener('scroll', (event) => {
			if (window.scrollY > 500) {
				this.setState({ changedBackgroundColor: true })
			  } else {
				this.setState({ changedBackgroundColor: false })
			  }
		});
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', () => {});
	}

	render() {
		if(!this.state.rss || !this.state.data) return null;
		let cl = this.state.changedBackgroundColor ? 'change' : '';
		let title = !this.state.data.title ? this.state.rss.title : this.state.data.title;
		return (
			<div id="background" className={cl}>
				<Header title={title} changedBackgroundColor={this.state.changedBackgroundColor}/>
				<main>
					<Modal data={this.state.data} status={this.state.modalStatus} closeWindow={this.closeModalWindow} updateData={this.updateData} />
					<Intro data={this.state.data} callWindow={this.callModalWindow} />
					<SearchBarMiddle />
					<Episodes episodes={this.state.data.episodes} changeEpisode={this.changeEpisode} />
				</main>
				<footer>
					<Player episodes={this.state.data.episodes} nowPlaying={this.state.nowPlaying} episodeAmount={this.state.episodeAmount} changeEpisode={this.changeEpisode} />
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

	handleSignUp = (event) => {
		event.preventDefault();
	}

	handleSearch = (event) => {
		event.preventDefault();
	}

	render() {
		let cl = this.props.changedBackgroundColor ? 'header-container change' : 'header-container';
		return (
			<header>
				{/* <span className="deco-bar"></span> */}
				<div className={cl}>
					<section className="name">
						<span className="dot"></span>
						<div className="header-texts">
							<h1>{this.props.title}</h1>
							<button className="login" onClick={this.handleSignUp}>Login</button>
						</div>
					</section>
					<form className="search-container-top">
						<input type="text" id="search-bar-desktop" placeholder="Episodes, Contents, Published Dates" />
						<button onClick={this.handleSearch}><i className="search-icon-top fa fa-search fa-1point5x" aria-hidden="true"></i></button>
					</form>
				</div>
			</header>
		);
	}
}

class SearchBarMiddle extends Component {
	handleSearch = (event) => {
		event.preventDefault();
	}

	render() {
		return (
			<div className="container search-container-middle">
				<form>
					<input type="text" id="search-bar-mobile" placeholder="Episodes, Contents, Published Dates" />
					<button onClick={this.handleSearch}><i className="search-btn-middle fa fa-search" aria-hidden="true"></i></button>
				</form>
			</div>
		)
	}
}