import React from 'react';
import Base from './base.jsx';
import Loader from './../../general/loader.jsx';

const EDITOR_PATH = '/assets/vendor/ckeditor/';

class CKEditor extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='form__wrapper'>
				<label htmlFor={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<textarea
					name={this.props.id}
					id={this.props.id}
					disabled={!this.props.isEnabled}
					value={this.props.initialValue}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}


	/*
	 * Run CKEditor configuration.
	 *
	 */
	configureEditor() {
		CKEDITOR.basePath = EDITOR_PATH;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4';
		CKEDITOR.config.format_h4 = { element: 'h4', attributes: { 'class': 'Notes under tables' } };
		CKEDITOR.config.toolbar = [
			[ 'Source','-','Undo','Redo','Cut','Copy','Paste','-','Find','Replace', 'Timestamp'],
			[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','Link','Unlink','-','Format','-','TextColor','BGColor' ]
		]
		CKEDITOR.config.height = '500px';
	}


	/*
	 * Create CKEditor instance.
	 *
	 */
	componentDidMount() {
		$().ensureScript('CKEDITOR', `${EDITOR_PATH}ckeditor.js`, () => {
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


	/*
	 * Destroy CKEditor instance.
	 *
	 */
	componentWillUnmount() {
		this.instance.destroy();
	}

}

export default CKEditor;