import React from 'react';

import Text from './subcomponents/text.jsx';
import Radio from './subcomponents/radio.jsx';
import SelectizeText from './subcomponents/selectize_text.jsx';
import ImageFile from './subcomponents/image_file.jsx';
import CKEditor from './subcomponents/ckeditor.jsx';

var Subcomponents = {
	Text: Text,
	Radio: Radio,
	SelectizeText: SelectizeText,
	ImageFile: ImageFile,
	CKEditor: CKEditor
};

class Form extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
	}

	setData(newDatum) {
		var data = this.state.data;
		data[newDatum.id] = newDatum.value;
		this.setState({ data: data });
	}

	render() {
		return (
			<form method='post' action='/post-test'>
				{ this.renderFormComponents() }
				<input type='submit' value='Create Project' />
			</form>
		);
	}

	renderFormComponents() {
		var model = new this.props.Model();
		return model.fields.map((field) => {
			var FormComp = Subcomponents[field.formComponentName] || Subcomponents.Text,
				props = field.formComponentProps || {};
			return (
				<FormComp {...props} sendData={this.setData.bind(this)} />
			);
		});
		return (<input />);
	}

	componentDidUpdate() {
		// console.log(this.state.data);
	}

}

export default Form;