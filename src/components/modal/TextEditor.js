import React, { Component } from 'react';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.description)))
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({ editorState: editorState });
        this.props.handleChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    };

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange} />
                {/* <textarea disabled value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} /> */}
            </div>
        );
    }
}