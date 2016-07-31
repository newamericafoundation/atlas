import _ from 'underscore'

import states from './../../../db/seeds/states.json'
import standardizeKey from './../utilities/standardize_key.js'

export function checkPin(data) {
	var foundLat = standardizeKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat'])
	var foundLong = standardizeKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long'])
	if (foundLat && foundLong) {
		data._itemType = 'pin'
	}
	return data
}

export function checkUsState(data) {
	if (data.name != null) {
		let stateData = _.where(states, {
			name: data.name
		})
		if ((stateData != null) && stateData.length > 0) {
			data.id = stateData[0].id
			data.code = stateData[0].code
			data._itemType = 'us_state'
		}
	}
	return data
}

export function checkUsCongressionalDistrict(data) {
	if (data.cngdstcd != null) {
		data.id = data.cngdstcd
		data._itemType = 'us_congressional_district'
	}
	return data
}

export default function setType(data) {
	checkPin(data)
	checkUsState(data)
	checkUsCongressionalDistrict(data)
	return data
}