import React, { Component } from 'react';
import './Modal.css';

export default class Modal extends Component {
    render() {
        if(this.props.status === 'none') return null;
        let window = (this.props.status === 'overview') ? 
            <EditOverviewWindow 
                data={this.props.data} 
                status={this.props.status} 
                closeWindow={this.props.closeWindow} 
                save={this.props.save}
                updateData={this.props.updateData} /> : null;
        return (
            <div id="forModal">
                <div className="modal">
                    {window}
                </div>
            </div>
        );
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
        this.props.updateData(data);
        this.props.closeWindow();
    }

    render() {
        return (
            <div className="modal-window">
                <div className="modal-top-bar">
                    <button className="close-button" onClick={this.closeWindow}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <button className="save-button" onClick={this.save}>Save</button>
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