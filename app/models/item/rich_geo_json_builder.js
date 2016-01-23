import rgf from './../rich_geo_feature.js'

function base(collection, baseGeoData, getFeatureId) {

    var data, richGeoJson
    var richGeoJson = new rgf.Collection()

    function setup(data) {
        richGeoJson.features = baseGeoData.features
        console.log(baseGeoData)
        for (let feature of richGeoJson.features) {
            let featureId = getFeatureId(feature)
            let item = collection.findWhere({
                id: featureId
            })
            feature._model = item
        }
        return richGeoJson.trigger('sync')
    }

    setup(baseGeoData)
    return richGeoJson

}

export function us_state(collection, baseGeoData) {
    return base(collection, baseGeoData, feature => parseInt(feature.properties.id, 10))
}

export function us_congressional_district(collection, baseGeoData) {
    return base(collection, baseGeoData, (feature) => {
        var props = feature.properties
        return parseInt(`${parseInt(props.state_id, 10)}${props.id}`, 10)
    })
}

export function pin(collection) {
    var richGeoJson = new rgf.Collection()
    for (let item of collection.models) {
        richGeoJson.features.push(item.toRichGeoJsonFeature())
    }
    richGeoJson.trigger('sync')
    return richGeoJson
}