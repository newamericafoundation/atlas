/**
 * Finds and replaces key.
 * @param {object} data - Data as key-value pairs.
 * @param {string} standardKey
 * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
 * @returns {boolean} found - Whether the key is found in the data.
 */
export default function standardizeKey(data, standardKey, keyAliases = []) {
	var found = false
	if (keyAliases.length === 0) { keyAliases = [ standardKey ] }
	for (let keyAlias of keyAliases) {
		if (data[keyAlias]) {
			found = true
			if (keyAlias !== standardKey) {
				data[standardKey] = data[keyAlias]
				delete data[keyAlias]
			}
		}
	}
	return found
}