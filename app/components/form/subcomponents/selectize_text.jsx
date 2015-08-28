Comp.Form.SelectizeText = class extends React.Component {

	render() {
		return (
			<div className='form__wrapper'>
				<label>{ this.props.labelText }</label>
				<input ref='input' type='text' name={this.props.id} placeholder={this.props.placeholder} />
			</div>
		);
	}

	componentDidMount() {
		var $el = $(React.findDOMNode(this.refs.input));
		$el.selectize({
			delimiter: ',',
			persist: true,
			create: function(input) {
				return { value: input, text: input };
			}
		}).on('change', this.sendData.bind(this));
	}

	componentWillUnmount() {
		var $el = $(React.findDOMNode(this.refs.input));
		$el[0].selectize.destroy();
	}

	sendData(e) {
		this.props.sendData({
			id: this.props.id,
			value: e.target.value
		});
	}

}