Comp.Form.SpreadsheetFile = class extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label>{ this.props.labelText }</label>
				<input 
					ref='input' 
					onChange={this.sendData.bind(this)} 
					type='file' 
					name={this.props.id} 
					id={this.props.id} 
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}

	sendData(e) {
		this.props.sendData({
			id: this.props.id,
			value: e.target.value
		});
	}

}