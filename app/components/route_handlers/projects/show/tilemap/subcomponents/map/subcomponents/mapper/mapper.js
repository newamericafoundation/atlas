import $ from 'jquery'

import RootView from './root_view.js'

import PinOverlayView from './overlay_views/pin.js'
import PathOverlayView from './overlay_views/path.js'

import * as shapeFile from './../../../../../../../../../models/shape_file.js'


/*
 *
 *
 */
var Mapper = {

    /*
     *
     *
     */
    stop: function() {
        if (Mapper.overlayView) { Mapper.overlayView.destroy() }
        if (Mapper.rootView) { return Mapper.rootView.destroy() }
    },


    /*
     *
     *
     */
    start: function() {

        var rootView = new RootView({ el: '#atl__map' })

        rootView.props = Mapper.props

        Mapper.rootView = rootView
        rootView.render()

        this.$loading = $("<div class='loader'><img src='/assets/images/spinner.gif'></div>")
        $('.atl__main').append(this.$loading)

        this.showOverlay()

    },


    /*
     *
     *
     */
    showOverlay: function() {

        var { items } = Mapper.props.project.get('data')
        var itemType = items.getItemType()

        var OverlayView = this.getOverlayViewConstructor(itemType)

        function launch(baseGeoData) {

            var coll = items.getRichGeoJson(baseGeoData)

            return coll.onReady(function() {
                var overlayView = new OverlayView({
                    map: Mapper.rootView.map,
                    collection: coll,
                    props: Mapper.props,
                    colors: Mapper.colors,
                    svgPaths: Mapper.svgPaths
                })
                Mapper.overlayView = overlayView
                return overlayView.render()
            })

        }

        if (itemType === 'pin') {
            launch()
            return this
        }

        var shps = new shapeFile.Collection()

        var shp = shps.findWhere({ name: `${itemType}s` })

        // Fetch shape file and launch.
        shp.getGeoJsonFetchPromise().then((data) => {
            launch(data)
        }).catch((err) => { console.log(err.stack) })

        return this

    },


    /*
     *
     *
     */
    getOverlayViewConstructor: function(itemType) {
        if (itemType === 'pin') { return PinOverlayView }
        return PathOverlayView
    }

}


export default Mapper