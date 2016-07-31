import React from 'react'


export default class ForeignCollectionBase extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			foreignCollection: null
		}
	}

	render() {
		return <div/>
	}

	fetchForeignCollection() {
		if (this.props.foreignCollection) { return }
		if (!this.props.foreignCollectionConstructor) { return }
		var coll = new this.props.foreignCollectionConstructor()
		coll.getClientFetchPromise().then((coll) => {
			this.setState({ foreignCollection: coll })
		}).catch((err) => { console.log(err.stack) })
	}

	navigateToForeignModelEdit(foreignModel) {
		if (!foreignModel || !foreignModel.getEditUrl) { return }
		var url = foreignModel.getEditUrl();
		if (this.props.history) {
			this.props.history.pushState(null, url);
		}
	}

	getForeignCollection() {
		if (this.props.foreignCollection) { return this.props.foreignCollection }
		return this.state.foreignCollection
	}

	getForeignCollectionDisplayField() {
		return this.props.foreignCollectionDisplayField || 'name'
	}

}