import React, { Component } from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import * as rssParser from 'react-native-rss-parser';

import Modal from './components/modal/Modal';
import Intro from './components/intro/Intro';
import Episodes from './components/episodes/Episodes';
import EpisodePage from './components/episodes/EpisodePage';
import Player from './components/player/Player';

import RSS from './rss.xml';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changedBackgroundColor: false,
			modalStatus: 'none',
			modalEpisodeId: null,
			nowPlaying: 0,
			autoPlay: false,
			episodeAmount: 0,
			hasMergeData: false,
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

	callEpisodeModalWindow = (status, id) => {
		this.setState({ 
			modalEpisodeId: id,
			modalStatus: status
		});
	}

	closeModalWindow = () => {
		this.setState({ 
			modalStatus: 'none'
		});
	}

	fetchRSSFeeds = (url) => {
		let promise = fetch(url)
			.then((response) => response.text())
			.then((responseData) => rssParser.parse(responseData))
			.then((rss) => {
				// map useful data from the feeds
				let its = {};
				rss.items.forEach((item) => {
					its[item.id] = {
						id: item.id,
						title: item.title,
						description: item.description,
						cover: rss.image.url,
						soundURL: item.enclosures[0].url,
						soundFormat: item.enclosures[0].mimeType,
						duration: item.itunes.duration,
						published: item.published
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
						episodes: its
					},
					episodeAmount: Object.keys(its).length
				});

				// retrieve data from firebase
				this.dataRef = firebase.database().ref('data');
				this.dataRef.child('data').on('value', (snapshot) => {
					let firebaseData = snapshot.val();
					if(this.state.hasMergeData === false) {
						['title', 'cover', 'overview', 'links', 'hosts'].forEach((key) => { if(!firebaseData[key]) firebaseData[key] = this.state.rss[key]; });
						// episodes
						if(!firebaseData.episodes) firebaseData.episodes = this.state.rss.episodes;
						else {
							let episodeKeys = Object.keys(this.state.rss.episodes);
							episodeKeys.forEach((key) => {
								if(!firebaseData.episodes[key]) firebaseData.episodes[key] = this.state.rss.episodes[key];
							});
						}
						// the first synchronization
						if(!(!this.state.user)) {
							this.dataRef.set({ data: firebaseData });
							this.setState({ hasMergeData: true });
						}
					}
					this.setState({ data: firebaseData });
				});
			});
		return promise;
	}

	handleSignUp = (email, password) => { // a callback function for registering new users
		this.setState({ errorMessage: null }); // clear any old errors
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				let user = userCredentials.user // access the newly created user
				.then((promise) => {
					console.log('User created: ' + user.uid);
					this.setState({ user: user })
					return promise;
				})
				.catch((error) => {
					this.setState({ errorMessage: error.message });
				});
			})
			.catch((error) => { // report any errors
				this.setState({ errorMessage: error.message });
				console.log(error.message);
			});
  	}
	
  	handleSignIn = (email, password) => { // a callback function for logging in existing users
		this.setState({ errorMessage: null }); // clear any old errors
		firebase.auth().signInWithEmailAndPassword(email, password)
			.catch((error) => {
				console.log(error.message);
				this.setState({ errorMessage: error.message });
			});
  	}
	
  	handleSignOut = () => { // a callback function for logging out the current user
		this.setState({ errorMessage: null }); // clear any old errors
		firebase.auth().signOut()
			.catch((error) => {
				console.log(error.message);
				this.setState({ errorMessage: error.message });
			});
  	}

	componentDidMount() {
		this.fetchRSSFeeds(RSS);
		window.addEventListener('scroll', (event) => {
			if (window.scrollY > 500) {
				this.setState({ changedBackgroundColor: true })
			  } else {
				this.setState({ changedBackgroundColor: false })
			  }
		});
		this.authUnregFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
			// this.setState({ loading: false });
			if(firebaseUser) {
				console.log('logged in');
				this.setState({ user: firebaseUser });
			} else {
				console.log('logged out');
				this.setState({ user: null });
			}
		});
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', () => {});
		this.dataRef.off();
		this.authUnregFunc();
	}

	renderFrontPage = (props) => {
		return (
			<main>
				<Intro data={this.state.data}
					user={this.state.user}
					callWindow={this.callModalWindow} />
				<Episodes user={this.state.user}
					episodes={this.state.data.episodes}
					changeEpisode={this.changeEpisode} 
					callWindow={this.callEpisodeModalWindow} />
			</main>
		);
	}

	render() {
		if(!this.state.rss || !this.state.data) return null;
		let cl = this.state.changedBackgroundColor ? 'change' : '';
		let title = !this.state.data.title ? this.state.rss.title : this.state.data.title;

		return (
			<div id="background" className={cl}>
				<Header title={title}
					user={this.state.user}
					changedBackgroundColor={this.state.changedBackgroundColor}
					callWindow={this.callModalWindow}
					handleSignOut={this.handleSignOut} />
				<Modal data={this.state.data}
					status={this.state.modalStatus}
					closeWindow={this.closeModalWindow}
					signUpCallback={this.handleSignUp} 
					signInCallback={this.handleSignIn}
					episodeId={this.state.modalEpisodeId} />
				<Switch>
					<Route exact path='/' render={this.renderFrontPage} />
					<Route path='/episode/:episodeId' render={(routerProps) => (
						<EpisodePage {...routerProps}
							user={this.state.user}
							episodes={this.state.data.episodes}
							changeEpisode={this.changeEpisode}
							callWindow={this.callEpisodeModalWindow} />)} />
					<Redirect to='/' />
				</Switch>
				<footer>
					<Player episodes={this.state.data.episodes}
						nowPlaying={this.state.nowPlaying}
						episodeAmount={this.state.episodeAmount}
						changeEpisode={this.changeEpisode} />
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
		this.props.callWindow('signup');
	}

	handleSignOut = (event) => {
		event.preventDefault();
		this.props.handleSignOut();
	}

	handleSearch = (event) => {
		event.preventDefault();
	}

	render() {
		let cl = this.props.changedBackgroundColor ? 'header-container change' : 'header-container';
		let button = (!this.props.user) ?
			(<button className="login" onClick={this.handleSignUp}>Login</button>) :
			(<button className="login" onClick={this.handleSignOut}>Sign Out</button>);
		return (
			<header>
				{/* <span className="deco-bar"></span> */}
				<div className={cl}>
						<section className="name">
							<Link to='/'>
								<span className="dot"></span>
							</Link>
							<div className="header-texts">
								<h1>{this.props.title}</h1>
								{button}
							</div>
						</section>
					{/* <form className="search-container-top">
						<input type="text" id="search-bar-desktop" placeholder="Episodes, Contents, Published Dates" />
						<button onClick={this.handleSearch}><i className="search-icon-top fa fa-search fa-1point5x" aria-hidden="true"></i></button>
					</form> */}
				</div>
			</header>
		);
	}
}

// class SearchBarMiddle extends Component {
// 	handleSearch = (event) => { event.preventDefault(); }
// 	render() {
// 		return (
// 			<div className="container search-container-middle">
// 				<form>
// 					<input type="text" id="search-bar-mobile" placeholder="Episodes, Contents, Published Dates" />
// 					<button onClick={this.handleSearch}><i className="search-btn-middle fa fa-search" aria-hidden="true"></i></button>
// 				</form>
// 			</div>
// 		)
// 	}
// }