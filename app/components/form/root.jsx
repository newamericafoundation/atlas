Comp.Form = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
	}

	setData(newDatum) {
		var data = this.state.data;
		data[newDatum.id] = newDatum.value;
		// console.log(data);
		this.setState({ data: data });
	}

	render() {
		return (
			<form method='post' action='/post-test'>
				{ this.renderFormComponents() }
				<input type='submit' value='Create Project' />
			</form>
		);
	}

	renderFormComponents() {
		var model = new this.props.Model();
		return model.fields.map((field) => {
			var FormComp = Comp.Form[field.formComponentName] || Comp.Form.Text,
				props = field.formComponentProps || {};
			return (
				<FormComp {...props} sendData={this.setData.bind(this)} />
			);
		});
		return (<input />);
	}

	componentDidUpdate() {
		console.log(this.state.data);
	}

}