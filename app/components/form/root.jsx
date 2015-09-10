import React from 'react';

import _ from 'underscore';

import Text from './subcomponents/text.jsx';
import Radio from './subcomponents/radio.jsx';
import SelectizeText from './subcomponents/selectize_text.jsx';
import SpreadsheetFile from './subcomponents/spreadsheet_file.jsx';
import ImageFile from './subcomponents/image_file.jsx';
import CKEditor from './subcomponents/ckeditor.jsx';
import ForeignCollectionRadio from './subcomponents/foreign_collection_radio.jsx';
import ForeignCollectionCheckBox from './subcomponents/foreign_collection_check_box.jsx';

var Subcomponents = {
	Text: Text,
	Radio: Radio,
	SelectizeText: SelectizeText,
	SpreadsheetFile: SpreadsheetFile,
	ImageFile: ImageFile,
	CKEditor: CKEditor,
	ForeignCollectionRadio: ForeignCollectionRadio,
	ForeignCollectionCheckBox: ForeignCollectionCheckBox
};

class Form extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			warnings: [],
			errors: []
		};
	}

	saveDataFromChild(childData) {

		var model = this.props.model,
			key = childData.id,
			oldValue = this.props.model.get(key),
			newValue = childData.value;

		// If the data field is an array, add value to array if not already added.
		// Otherwise, replace old data.
		if (_.isArray(oldValue)) {
			if (oldValue.indexOf(newValue) === -1) {
				oldValue.push(newValue);
				model.set(key, oldValue);
			}
		} else {
			model.set(key, newValue);
		}

		this.forceUpdate();
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<form 
				onSubmit={this.sendFormDataToParent.bind(this)}
			>
				{ this.renderFormComponents() }
				<input 
					type='submit' 
					value={ this.props.submitButtonText || 'Submit Form' } 
				/>
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
					saveDataOnParent={this.saveDataFromChild.bind(this)}
					initialValue={this.props.model.get(id)}
				/>
			);
		});
		return (<input />);
	}

	sendFormDataToParent(e) {
		e.preventDefault();
		this.props.onSubmit(this.props.model);
	}

}

export default Form;