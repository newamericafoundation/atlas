// Form component backed by a Backbone model.

import React from 'react'
import _ from 'underscore'

import * as Subcomponents from './subcomponents/index.js'


export default class Form extends React.Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		var style = this.props.isEnabled ? {} : { opacity: 0.5 }
		var { isEnabled, submitButtonText } = this.props
		return (
			<form
				onSubmit={this.sendFormDataToParent.bind(this)}
				style={style}
			>
				{ this.renderFormComponents() }
				<input 
					type='submit'
					disabled={!isEnabled}
					value={ submitButtonText || 'Submit Form' } 
				/>
			</form>
		)
	}

	renderFormComponents() {
		return this.props.model.fields.map((field, i) => {
			var FormComp = Subcomponents[field.formComponentName] || Subcomponents.Text
			var id = field.formComponentProps.id
			var props = field.formComponentProps || {}
			return (
				<FormComp
					{...props}
					model={this.props.model}
					history={this.props.history}
					key={i}
					isEnabled={this.props.isEnabled}
					saveDataOnParent={this.saveDataFromChild.bind(this)}
					initialValue={this.props.model.get(id)}
				/>
			)
		})
	}

	saveDataFromChild(childData) {

		var { model } = this.props
		var key = childData.id
		var currentValue = model.get(key)
		var incomingValue = childData.value

		// If the data field is an array, add the incoming value if the array does not contain it but remove it if it does.
		// This behavior is specific to the ForeignCollectionCheckBox subcomponent.
		if (_.isArray(currentValue)) {
			let index = currentValue.indexOf(incomingValue)
			if (index < 0) {
				currentValue.push(incomingValue)
			} else {
				currentValue.splice(index, 1)
			}
			model.set(key, currentValue)
		} else {
			model.set(key, incomingValue)
		}

		this.forceUpdate()
		
	}

	sendFormDataToParent(e) {
		e.preventDefault()
		this.props.onSubmit(this.props.model)
	}

}