import React from 'react';
import Base from './base.jsx';

class CKEditor extends Base {

	constructor(props) {
		super(props);
		this.editorBasePath = '/assets/vendor/ckeditor/';
	}

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<textarea
					name={this.props.id}
					id={this.props.id}
					value={this.props.initialValue}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	configureEditor() {
		CKEDITOR.basePath = this.editorBasePath;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4';
		CKEDITOR.config.format_h4 = { element: 'h4', attributes: { 'class': 'Notes under tables' } };
		CKEDITOR.config.toolbar = [
			[ 'Source','-','Undo','Redo','Cut','Copy','Paste','-','Find','Replace', 'Timestamp'],
			[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','Link','Unlink','-','Format','-','TextColor','BGColor' ]
		]
		CKEDITOR.config.height = '500px';
	}

	componentDidMount() {
		$().ensureScript('CKEDITOR', this.editorBasePath + 'ckeditor.js', () => {
			this.configureEditor();
			this.instance = CKEDITOR.replace(this.props.id);
			this.instance.on('key', (e) => {
				this.props.saveDataOnParent({
					id: this.props.id,
					value: this.instance.getData()
				});
			});
		});
	}

	componentWillUnmount() {
		this.instance.destroy();
	}

}

export default CKEditor;