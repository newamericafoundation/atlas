import React from 'react';
import Base from './base.jsx';

class Radio extends Base {

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
		return this.props.options.map((option, i) => {
			var isChecked = this.isOptionChecked(option, i);
			return (
				<div className='form__radio'>
					<input 
						type='radio' 
						name={this.props.id} 
						id={this.props.id + '-opt-' + i} 
						checked={ isChecked }
						onChange={this.saveDataOnParent.bind(this)} 
						value={ option }
					/>
					<p>{ option }</p>
				</div>
			);
		});
	}

	isOptionChecked(option, i) {
		if(this.props.initialValue) { return (option === this.props.initialValue); }
		return (i === 0);
	}

	componentDidMount() {
		// If there was no initial value passed to the component, pass back the first option to the parent.
		if(!this.props.initialValue) {
			this.props.saveDataOnParent({
				id: this.props.id,
				value: this.props.options[0]
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

export default Radio;