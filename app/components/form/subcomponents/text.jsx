Comp.Form.Text = class extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label>{ this.props.labelText }</label>
				<input type='text' onChange={this.sendData.bind(this)} name={this.props.id} placeholder={this.props.placeholder} />
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