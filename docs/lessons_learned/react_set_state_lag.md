React's state update is not instantaneous, so the following code will not work as expected:

	this.setState({ formFieldValue: e.target.value });
	this.props.someEventEmitter.trigger('form:field:value:change', this.state.formFieldValue);

Since state is not updated yet, the event will be triggered with the old state value.