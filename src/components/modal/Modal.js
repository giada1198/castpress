import React, { Component } from 'react';
import TextEditor from './TextEditor';
import firebase from 'firebase/app';
import './Modal.css';

export default class Modal extends Component {
    render() {
        if(this.props.status === 'none') return null;
        let window = (this.props.status === 'overview') ? 
            <EditOverviewWindow 
                data={this.props.data} 
                status={this.props.status} 
                closeWindow={this.props.closeWindow} 
                save={this.props.save} /> :
            (this.props.status === 'signup') ?
            <SignUpWindow
                status={this.props.status}
                closeWindow={this.props.closeWindow}
                signUpCallback={this.props.signUpCallback} 
                signInCallback={this.props.signInCallback} /> :
            (this.props.status === 'episode') ?
            <EditEpisodeWindow
                key={this.props.episodeId}
                episode={this.props.data.episodes[this.props.episodeId]} 
                episodeId={this.props.episodeId}
                closeWindow={this.props.closeWindow} /> : 
                null;
        return (
            <div id="forModal">
                <div className="modal">
                    {window}
                </div>
            </div>
        );
    }
}

class SignUpWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': undefined,
            'password': undefined,
            'handle': undefined,
            'avatar': '' //default to blank value
        };
    }

    handleChange = (event) => {
        let field = event.target.name; //which input
        let value = event.target.value; //what value
    
        let changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }
    
    //handle signUp button
    handleSignUp = (event) => {
        event.preventDefault();
        this.props.signUpCallback(this.state.email, this.state.password);
        this.props.closeWindow();
    }
    
    //handle signIn button
    handleSignIn = (event) => {
        event.preventDefault();
        this.props.signInCallback(this.state.email, this.state.password);
        this.props.closeWindow();
    }

    closeWindow = () => {
        this.props.closeWindow();
    }

    render() {
        return (
            <div className="modal-window">
                <div className="modal-top-bar">
                    <button className="close-button" onClick={this.closeWindow}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <div>
                        <button className="button" onClick={this.handleSignUp}>Sign-up</button>
                        <button className="button" onClick={this.handleSignIn}>Sign-in</button>
                    </div>
                </div>
                <div className="modal-content">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input className="form-control"
                            onChange={this.handleChange}
                            id="email"
                            type="email"
                            name="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input className="form-control"
                            onChange={this.handleChange}
                            id="password"
                            type="password"
                            name="password" />
                    </div>
                </div>
            </div>
        )
    }
}

class EditOverviewWindow extends Component {
	constructor(props) {
        super(props);
        this.state = {
            overview: this.props.data.overview,
            links: this.props.data.links
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let overviewItems = ['primary', 'secondary'];
        let linkItems = ['apple-podcasts', 'spotify', 'google-podcasts'];

        if(overviewItems.includes(name)) {
            let overview = this.state.overview;
            overview[name] = value;
            this.setState({
                overview: overview
            });
        } else if(linkItems.includes(name)) {
            let links = this.state.links;
            links[name] = value;
            this.setState({
                links: links
            });
        }
    }

    closeWindow = () => {
        this.props.closeWindow();
    }

    save = () => {
        let data = this.props.data;
        Object.keys(this.state).forEach((key) => {
            data[key] = this.state[key];
        });
        let dataRef = firebase.database().ref('data');
        dataRef.set({ data: data })
        this.props.closeWindow();
    }

    render() {
        return (
            <div className="modal-window">
                <div className="modal-top-bar">
                    <button className="close-button" onClick={this.closeWindow}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <button className="button" onClick={this.save}>Save</button>
                </div>
                <div className="modal-content">
                    <div>
                        <label htmlFor="primary description">Primary Description</label>
                        <textarea value={this.state.overview.primary} onChange={this.handleChange} id="primary description" rows="3" name="primary"></textarea>
                    </div>
                    <div>
                        <label htmlFor="secondary description">Secondary Description</label>
                        <textarea value={this.state.overview.secondary} onChange={this.handleChange} id="secondary description" rows="3" name="secondary"></textarea>
                    </div>
                    <div>
                        <label htmlFor="apple podcasts">Apple Podcasts</label>
                        <input value={this.state.links['apple-podcasts']} onChange={this.handleChange} id="apple podcasts" type="url" name="apple-podcasts" />
                    </div>
                    <div>
                        <label htmlFor="spotify">Spotify</label>
                        <input value={this.state.links['spotify']} onChange={this.handleChange} id="spotify" type="url" name="spotify" />
                    </div>
                    <div>
                        <label htmlFor="google podcasts">Google Podcasts</label>
                        <input value={this.state.links['google-podcasts']} onChange={this.handleChange} id="google podcasts" type="url" name="google-podcasts" />
                    </div>
                </div>
            </div>
        );
    }
}

class EditEpisodeWindow extends Component {
	constructor(props) {
        super(props);
        this.state = {
            title: this.props.episode.title,
            description: this.props.episode.description
        };
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if(name === 'title') this.setState({ title: value });
    }

    handleDescriptionChange = (input) => {
        this.setState({ description: input });
    }

    closeWindow = () => {
        this.props.closeWindow();
    }

    save = () => {
        let path = 'data/data/episodes/' + this.props.episodeId
        console.log(path);
        let dataRef = firebase.database().ref(path);
        // dataRef.once('value').then((snapshot) => {
        //     console.log(snapshot.val());
        // });
        dataRef.child('title').set(this.state.title);
        dataRef.child('description').set(this.state.description);
        this.props.closeWindow();
    }

    render() {
        return (
            <div className="modal-window">
                <div className="modal-top-bar">
                    <button className="close-button" onClick={this.closeWindow}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <button className="button" onClick={this.save}>Save</button>
                </div>
                <div className="modal-content">
                    <div>
                        <label htmlFor="title">Title</label>
                        <input value={this.state.title}
                            onChange={this.handleChange}
                            id="title"
                            name="title" />
                    </div>
                    <label htmlFor="apple podcasts">Description</label>
                    <TextEditor description={this.state.description}
                        handleChange={this.handleDescriptionChange} />
                </div>
            </div>
        );
    }
}