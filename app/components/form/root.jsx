// Form component backed by a Backbone model.

import React from 'react';
import _ from 'underscore';

import * as Subcomponents from './subcomponents/index.js';

class Form extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {};
	}


	/*
	 *
	 *
	 */
	render() {
		var style = this.props.isEnabled ? {} : { opacity: 0.5 };
		return (
			<form 
				onSubmit={this.sendFormDataToParent.bind(this)}
				style={style}
			>
				{ this.renderFormComponents() }
				<input 
					type='submit'
					disabled={!this.props.isEnabled}
					value={ this.props.submitButtonText || 'Submit Form' } 
				/>
			</form>
		);
	}


	/*
	 *
	 *
	 */
	renderFormComponents() {
		return this.props.model.fields.map((field, i) => {
			var FormComp = Subcomponents[field.formComponentName] || Subcomponents.Text,
				id = field.formComponentProps.id,
				props = field.formComponentProps || {};
			return (
				<FormComp 
					{...props}
					key={i}
					isEnabled={this.props.isEnabled}
					saveDataOnParent={this.saveDataFromChild.bind(this)}
					initialValue={this.props.model.get(id)}
				/>
			);
		});
		return (<input />);
	}


	/*
	 *
	 *
	 */
	saveDataFromChild(childData) {

		var model = this.props.model,
			key = childData.id,
			currentValue = this.props.model.get(key),
			incomingValue = childData.value;

		// If the data field is an array, add the incoming value if the array does not contain it but remove it if it does.
		// This behavior is specific to the ForeignCollectionCheckBox subcomponent.
		if (_.isArray(currentValue)) {
			let index = currentValue.indexOf(incomingValue);
			if (index < 0) {
				currentValue.push(incomingValue);
			} else {
				currentValue.splice(index, 1);
			}
			model.set(key, currentValue);
		} else {
			model.set(key, incomingValue);
		}

		this.forceUpdate();
	}

	
	/*
	 * Run method passed down from parent.
	 *
	 */
	sendFormDataToParent(e) {
		e.preventDefault();
		this.props.onSubmit(this.props.model);
	}

}

export default Form;