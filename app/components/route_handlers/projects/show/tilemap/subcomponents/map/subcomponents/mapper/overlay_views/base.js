// overlay view layers inherit from this object

import $ from 'jquery'
import classNames from 'classnames'

import colors from './../../../../../../../../../utilities/colors.js'


/*
 *
 *
 */
class BaseOverlayView {

    /*
     *
     *
     */
    constructor(options = {}) {
        for (let key in options) { this[key] = options[key] }
        this.props.radio.reqres.setHandler('item:map:position', item => this.getItemMapPosition(item))
        return this
    }


    /*
     *
     *
     */
    setMapEventListeners() {
        this.map.on('viewreset', this.update.bind(this))
        this.map.on('click', this.onMapClick.bind(this))
    }


    /*
     * Initialize.
     *
     */
    renderSvgContainer() {

        this.svg = d3.select(this.map.getPanes().overlayPane)
            .append('svg')
            .attr('class', 'deethree');

        this.g = this.svg.append('g')
            .attr('class', 'deethree__main-group leaflet-zoom-hide');

        this.gAux = this.svg.append('g')
            .attr('class', 'deethree__aux-group leaflet-zoom-hide');

    }


    /*
     *
     *
     */
    setHeaderStripColor() {
        var { project, radio } = this.props
        var indeces = project.getFriendlyIndeces()
        if (indeces.length > 0) {
            radio.commands.execute('set:header:strip:color', { color: colors.toRgb(indeces[0] - 1) })
        } else {
            radio.commands.execute('set:header:strip:color', 'none')
        }
    }


    /*
     * Return pixel coordinates of a map display item's centroid.
     *
     */
    getItemMapPosition(item) {

        var feature = this.getFeatureByModel(item)

        // Get feature centroid.
        var identityPath = d3.geo.path().projection((d) => { return d })
        var longLatArrayCentroid = identityPath.centroid(feature)

        var latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0])

        // Call options generator.
        var options = this.getFeaturePathOptions(feature)

        return this.latLongToModifiedLayerPoint([ longLatArrayCentroid[1], longLatArrayCentroid[0] ], options)

    }


    /*
     * Get modified layer point.
     * @param {array} latLongPosition - Latitude longitude array.
     */
    latLongToModifiedLayerPoint(latLongPosition, options = {}) {

        var { map } = this

        var { 
            latLongOriginCenter, // point to which scaling is specified. Typically the centroid of a shape.
            latLongDestinationCenter,  // point to which the origin center should be displaced to.
            scale, // scale factor
            pixelOffset, // final offset in pixels. Used to position map pins.
            leafletConvertMethodName
        } = options

        leafletConvertMethodName = leafletConvertMethodName || 'latLngToContainerPoint'

        // Default pixel offset to zero and scale to 1.
        pixelOffset = pixelOffset || [ 0, 0 ]
        scale = scale || 1

        var position = map[leafletConvertMethodName](new L.LatLng(latLongPosition[0], latLongPosition[1]))

        if (!latLongOriginCenter || !latLongDestinationCenter) {
            return { 
                x: position.x + pixelOffset[0], 
                y: position.y + pixelOffset[1]
            }; 
        }

        var originCenter = map[leafletConvertMethodName](new L.LatLng(latLongOriginCenter[0], latLongOriginCenter[1]));

        var destinationCenter = map[leafletConvertMethodName](new L.LatLng(latLongDestinationCenter[0], latLongDestinationCenter[1]));
        
        // Scale coordinates with respect to origin, move to destination and add offset.
        return {
            x: (position.x - originCenter.x) * scale + destinationCenter.x + pixelOffset[0],
            y: (position.y - originCenter.y) * scale + destinationCenter.y + pixelOffset[1]
        }

    }


    /*
     * Get d3 path.
     *
     */
    getPath(options = {}) {

        var self = this

        options.leafletConvertMethodName = 'latLngToLayerPoint'

        var projectPoint = function(lng, lat) {
            var point = self.latLongToModifiedLayerPoint([ lat, lng ], options)
            this.stream.point(point.x, point.y)
            return this
        }

        var transform = d3.geo.transform({ point: projectPoint })
        var path = d3.geo.path().projection(transform)

        return path

    }


    /*
     * Get class name string for a map item.
     *
     */
    getFeatureClassName(feature, baseClassName) {
        var displayState = this.getFeatureDisplayState(feature)
        var cls = `${baseClassName} ${baseClassName}__element`
        if (displayState) { cls += ` ${baseClassName}--${displayState}` }
        return cls;
    }


    /*
     * Customize on subclass.
     *
     */
    getFeaturePathOptions(feature) {
        return;
    }


    /*
     * Fade out, update entire overlaypane and fade back in.
     *
     */
    updateAnimated() {
        var $el = $('.leaflet-overlay-pane')
        // call stop() to reset previously started animations
        $el.stop().animate({ opacity: 0 }, 750, 'swing', () => {
            this.update()
            $el.animate({ opacity: 1 }, 750)
        })
    }


    /*
     * Callback.
     *
     */
    onFeatureMouseOut(feature) {
        var project, items;
        project = this.props.project;
        items = project.get('data').items;
        items.setHovered(-1);
        this.setHeaderStripColor();
        this.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true });
    }


    /*
     * Callback.
     *
     */
    onFeatureMouseOver(feature) {
        if (this.bringFeatureToFront) {
            this.bringFeatureToFront(feature)
        }
        var { project } = this.props
        var { items } = project.get('data')
        var model = feature._model ? feature._model : feature.id
        items.setHovered(model)
        this.setHeaderStripColor()
        this.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true })
    }


    /*
     * Callback.
     *
     */
    onFeatureClick(feature) {
        // Set whether the next map click should be ignored. If this was set to true, exit callback right away.
        if(this.map && this.map.ignoreNextClick) {
            this.map.ignoreNextClick = false
            return
        }

        if (d3.event.stopPropagation) { d3.event.stopPropagation() }

        var model = feature._model
        var { project } = this.props
        var { items } = project.get('data')
        items.setActive(model)
        this.props.setUiState({ isInfoBoxActive: true })
        this.map.ignoreNextClick = false
        this.activeFeature = feature
        return this
    }


    /*
     *
     *
     */
    onRender() {
        $('.loading-icon').remove()
    }


    /*
     * Callback.
     *
     */
    onMapClick(e) { 
        if (this.activeFeature) {
            delete this.activeFeature
            this.props.radio.vent.trigger('item:deactivate')
        }
    }


    /*
     * Returns feature corresponding to model.
     *
     */
    getFeatureByModel(model) {
        for (let feature of this.collection.features) {
            if (feature._model === model) { return feature }
        }
    }


    /*
     * Returns display state of a feature.
     *
     */
    getFeatureDisplayState(feature) {
        var filter, searchTerm, model, project;
        project = this.props.project;
        filter = project.get('data').filter;
        searchTerm = this.props.uiState.searchTerm;
        model = feature._model;
        if (model) {
            return model.getDisplayState(filter, searchTerm);
        }
    }


    /*
     * Get feature fill.
     * @param {object} feature
     * @returns {string} fill - Color string or stripe pattern url.
     */
    getFill(feature) {
        var { filter } = this.props.project.get('data')
        var valueIndeces = filter.getFriendlyIndeces(feature._model, 15)
        if (!valueIndeces || valueIndeces.length === 0) { return }
        if (valueIndeces.length === 1) {
            return colors.toRgb(valueIndeces[0]-1)
        }

        // Communicate with Comp.Setup.Component to create and retrieve stripe pattern id
        var id = this.props.radio.reqres.request('get:pattern:id', valueIndeces)
        return `url(#stripe-pattern-${id})`
    }


    /*
     * Checks if bounds are finite.
     * @returns {boolean}
     */
    _areBoundsFinite(bounds) {
        return (isFinite(bounds[0][0]) && isFinite(bounds[0][1]) && isFinite(bounds[1][0]) && isFinite(bounds[1][1]));
    }


    /*
     * Resizes and repositions svg container and its direct child group.
     * @param {object} svg
     * @param {object} g
     * @param {object} geoJson
     * @param {object} path
     * @param {number} extraExpansion - Pixel amount the svg container is to be expanded by, in order to avoid clipping off parts of shapes close to the edge.
     */ 
    resizeContainer(geoJson, path, extraExpansion) {

        var bounds = path.bounds(geoJson)
        if (!this._areBoundsFinite(bounds)) { return }
        bounds[0][0] -= extraExpansion
        bounds[0][1] -= extraExpansion
        bounds[1][0] += extraExpansion
        bounds[1][1] += extraExpansion

        var topLeft = bounds[0]
        var bottomRight = bounds[1]

        this.svg
            .attr({ 'width': bottomRight[0] - topLeft[0], 'height': bottomRight[1] - topLeft[1] + 50 })
            .style({ 'left': topLeft[0] + 'px', 'top': topLeft[1] + 'px' })

        this.g
            .attr("transform", `translate(${-topLeft[0]},${-topLeft[1]})`)
        return this

    }


    /*
     * Destroy overlay view along with all event listeners.
     *
     */
    destroy() {
        if (this.stopListening) { this.stopListening() }
        this.g.selectAll('path').remove()
        this.g.remove()
        this.svg.remove()
        return this
    }

}

export default BaseOverlayView