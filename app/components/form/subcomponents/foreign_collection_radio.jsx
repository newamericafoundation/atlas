import React from 'react';
import ForeignCollectionBase from './foreign_collection_base.jsx';

import Loader from './../../general/loader.jsx';

class ForeignCollectionRadio extends ForeignCollectionBase {

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
				{ this.renderOptions() }
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderOptions() {
		var foreignColl = this.getForeignCollection(),
			field = this.getForeignCollectionDisplayField();
		if (!foreignColl || foreignColl.length === 0) { return <Loader /> }
		return foreignColl.map((foreignModel, i) => {
			var option = foreignModel.get('id'),
				isChecked = this.isOptionChecked(option, i);
			return (
				<div className='form__radio' key={i}>
					<input 
						type='radio' 
						name={this.props.id}
						id={this.props.id + '-opt-' + i}
						disabled={!this.props.isEnabled}
						checked={ isChecked }
						onChange={this.saveDataOnParent.bind(this)} 
						value={ option } 
					/>
					<p>{ foreignModel.get(field) }</p>
				</div>
			);
		});
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		// If there was no initial value passed to the component, pass back the first option to the parent.
		this.fetchForeignCollection();
	}


	/*
	 *
	 *
	 */
	isOptionChecked(option, i) {
		if(this.props.initialValue) { return (option === this.props.initialValue); }
		return false;
	}


	/*
	 *
	 *
	 */
	saveDataOnParent(e) {
		this.props.saveDataOnParent({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default ForeignCollectionRadio;