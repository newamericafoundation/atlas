import React from 'react';

class Radio extends React.Component {

	constructor(props) {
		super(props);
		// When the form is first displayed, the first item should be checked.
		//   after there is form interaction, checked state should not be manipulted by React.
		this.shouldSetDefaultOption = false;
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
			var isChecked = this.shouldSetDefaultOption ? undefined : (i === 0);
			return (
				<div className='form__radio'>
					<input 
						type='radio' 
						name={this.props.id} 
						id={this.props.id + '-opt-' + i} 
						checked={ isChecked }
						onChange={this.sendData.bind(this)} 
						value={ option } 
					/>
					<p>{ option }</p>
				</div>
			);
		});
	}

	componentDidMount() {
		this.props.sendData({
			id: this.props.id,
			value: this.props.options[0]
		});
	}

	sendData(e) {
		this.shouldSetDefaultOption = true;
		this.props.sendData({
			id: this.props.id,
			value: e.target.value
		});
	}

}

export default Radio;