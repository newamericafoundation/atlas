Comp.Form.ImageFile = class extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label>{ this.props.labelText }</label>
				<p className='form__hint'>{ this.props.hint }</p>
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

		var file = e.target.files[0];
		var reader = new FileReader();

		reader.onload = () => { 
			var b64 = reader.result;
			console.log('setting image');
			this.props.sendData({
				id: this.props.id,
				value: b64
			});
		};

		reader.readAsDataURL(file);

	}

}