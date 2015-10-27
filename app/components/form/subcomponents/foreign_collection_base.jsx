import React from 'react';
import Base from './base.jsx';

class ForeignCollectionBase extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = this.state || {};
		this.state.foreignCollection = null;
	}


	/*
	 *
	 *
	 */
	render() {
		return (<div/>);
	}


	/*
	 * Fetch foreign collection if one is not passed down through props.
	 *
	 */
	fetchForeignCollection() {
		if (this.props.foreignCollection) { return; }
		if (!this.props.foreignCollectionConstructor) { return; }
		var coll = new this.props.foreignCollectionConstructor();
		coll.getClientFetchPromise().then((coll) => {
			this.setState({ foreignCollection: coll });
		}).catch((err) => { console.log(err.stack); });
	}


	/*
	 *
	 *
	 */
	navigateToForeignModelEdit(foreignModel) {
		console.log(foreignModel, foreignModel.getEditUrl());
		if (!foreignModel || !foreignModel.getEditUrl) { return; }
		var url = foreignModel.getEditUrl();
		if (this.props.history) {
			this.props.history.pushState(null, url);
		}
	}


	/*
	 * The foreign collection is either passed down directly through props or fetched to state.
	 *
	 */
	getForeignCollection() {
		if (this.props.foreignCollection) { return this.props.foreignCollection; }
		return this.state.foreignCollection;
	}


	/*
	 *
	 *
	 */
	getForeignCollectionDisplayField() {
		return this.props.foreignCollectionDisplayField || 'name';
	}

}


export default ForeignCollectionBase;