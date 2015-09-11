import React from 'react';
import Base from './base.jsx';

class ForeignCollectionCheckBox extends Base {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				{ this.renderOptions() }
			</div>
		);
	}

	renderOptions() {
		return this.props.foreignCollection.map((foreignModel, i) => {
			var option = foreignModel.get('id'),
				isChecked = this.isOptionChecked(option, i);
			return (
				<div className='form__radio'>
					<input 
						type='checkbox' 
						name={this.props.id}
						id={this.props.id + '-opt-' + i}
						disabled={!this.props.isEnabled}
						checked={ isChecked }
						onChange={this.saveDataOnParent.bind(this)} 
						value={ option } 
					/>
					<p>{ foreignModel.get('name') }</p>
				</div>
			);
		});
	}

	isOptionChecked(option, i) {
		// ! initialValue is an array !
		if(this.props.initialValue) { return (this.props.initialValue.indexOf(option) > -1); }
		return (i === 0);
	}

	componentDidMount() {
		// If there was no initial value passed to the component, pass back the first option to the parent.
		if(!this.props.initialValue) {
			this.props.saveDataOnParent({
				id: this.props.id,
				value: [ this.props.foreignCollection.models[0].get('id') ]
			});
		}
	}

	saveDataOnParent(e) {
		this.props.saveDataOnParent({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default ForeignCollectionCheckBox;