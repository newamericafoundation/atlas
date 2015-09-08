import React from 'react';

import Text from './subcomponents/text.jsx';
import Radio from './subcomponents/radio.jsx';
import SelectizeText from './subcomponents/selectize_text.jsx';
import SpreadsheetFile from './subcomponents/spreadsheet_file.jsx';
import ImageFile from './subcomponents/image_file.jsx';
import CKEditor from './subcomponents/ckeditor.jsx';

var Subcomponents = {
	Text: Text,
	Radio: Radio,
	SelectizeText: SelectizeText,
	SpreadsheetFile: SpreadsheetFile,
	ImageFile: ImageFile,
	CKEditor: CKEditor
};

class Form extends React.Component {

	constructor(props) {
		super(props);
	}

	setData(newDatum) {
		console.log(newDatum.id, newDatum.value);
		this.props.model.set(newDatum.id, newDatum.value);
		console.log(this.props.model);
		this.forceUpdate();
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
		return this.props.model.fields.map((field) => {
			var FormComp = Subcomponents[field.formComponentName] || Subcomponents.Text,
				id = field.formComponentProps.id,
				props = field.formComponentProps || {};
			return (
				<FormComp 
					{...props} 
					sendData={this.setData.bind(this)}
					initialValue={this.props.model.get(id)}
				/>
			);
		});
		return (<input />);
	}

}

export default Form;