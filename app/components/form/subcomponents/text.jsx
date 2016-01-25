import React from 'react'


export default class Text extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label htmlFor={this.props.id}>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					type='text'
					onChange={this.saveDataOnParent.bind(this)}
					disabled={!this.props.isEnabled}
					name={this.props.id}
					id={this.props.id}
					value={this.props.initialValue}
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	saveDataOnParent(e) {
		this.props.saveDataOnParent({
			id: this.props.id,
			value: e.target.value
		});
	}

}