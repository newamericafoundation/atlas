Comp.Form.CKEditor = class extends React.Component {

	constructor(props) {
		super(props);
		this.editorBasePath = '/assets/vendor/ckeditor';
		// this.editorBasePath = '//cdn.ckeditor.com/4.5.3/standard';
	}

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<textarea
					onChange={this.sendData.bind(this)} 
					name={this.props.id}
					id={this.props.id}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	configureEditor() {
		window.CKEDITOR_BASEPATH = this.editorBasePath;
		CKEDITOR.config.basePath = this.editorBasePath;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4';
		CKEDITOR.config.format_h4 = { element: 'h4', attributes: { 'class': 'Notes under tables' } };
		CKEDITOR.config.extraPlugins = 'timestamp';
		CKEDITOR.config.toolbar = [
			[ 'Source','-','Undo','Redo','Cut','Copy','Paste','-','Find','Replace', 'Timestamp'],
			[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','Link','Unlink','-','Format','-','TextColor','BGColor' ]
		]
		CKEDITOR.config.height = '500px';
	}

	componentDidMount() {
		$().ensureScript('CKEDITOR', this.editorBasePath + '/ckeditor.js', () => {
			this.configureEditor();
			CKEDITOR.replace(this.props.id);
		});
	}

	sendData(e) {
		this.props.sendData({
			id: this.props.id,
			value: e.target.value
		});
	}

}