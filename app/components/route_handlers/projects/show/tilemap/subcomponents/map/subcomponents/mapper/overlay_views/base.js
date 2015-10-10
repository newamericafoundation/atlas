// overlay view layers inherit from this object

import $ from 'jquery';

class BaseOverlayView {

    /*
     *
     *
     */
    constructor(options = {}) {
        for (let key in options) {
            this[key] = options[key];
        }
        this.props.radio.reqres.setHandler('item:map:position', (item) => { return this.getItemMapPosition(item); });
        return this;
    }


    /*
     *
     *
     */
    setMapEventListeners() {
        this.map.on('viewreset', this.update.bind(this));
        this.map.on('click', this.onMapClick.bind(this));
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
            .attr('class', 'leaflet-zoom-hide');
    }


    /*
     *
     *
     */
    setHeaderStripColor() {
        var project, indeces;
        project = this.props.project;
        indeces = project.getFriendlyIndeces();
        if (indeces.length > 0) {
            this.props.radio.commands.execute('set:header:strip:color', { color: this.colors.toRgb(indeces[0] - 1) });
        } else {
            this.props.radio.commands.execute('set:header:strip:color', 'none');
        }
    }


    /*
     * Return pixel coordinates of a map display item's centroid.
     *
     */
    getItemMapPosition(item) {
        var identityPath, feature, longLatArrayCentroid, latLong, map;
        identityPath = d3.geo.path().projection((d) => { return d; });
        feature = this.getFeatureByModel(item)
        longLatArrayCentroid = identityPath.centroid(feature)
        latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0]);
        map = this.map;
        return map.latLngToContainerPoint(latLong);
    }


    /*
     * Fade out, update entire overlaypane and fade back in.
     *
     */
    updateAnimated() {
        var $el = $('.leaflet-overlay-pane')
        // call stop() to reset previously started animations
        $el.stop().animate({ opacity: 0 }, 750, 'swing', () => {
            this.update();
            $el.animate({ opacity: 1 }, 750);
        });
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
        var project, items, model;
        if (this.bringFeatureToFront) {
            this.bringFeatureToFront(feature);
        }
        project = this.props.project;
        items = project.get('data').items;
        model = feature._model ? feature._model : feature.id;
        items.setHovered(model);
        this.setHeaderStripColor();
        this.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true });
    }


    /*
     * Callback.
     *
     */
    onFeatureClick(feature) {
        var model, project, items;
        if(this.map && this.map.ignoreNextClick) {
            this.map.ignoreNextClick = false;
            return;
        }
        if (d3.event.stopPropagation) {
            d3.event.stopPropagation();
        }
        model = feature._model;
        project = this.props.project;
        items = project.get('data').items;
        items.setActive(model);
        this.props.setUiState({ isInfoBoxActive: true });
        this.map.ignoreNextClick = false;
        this.activeFeature = feature;
        return this;
    }


    /*
     *
     *
     */
    onRender() {
        $('.loading-icon').remove();
    }


    /*
     * Callback.
     *
     */
    onMapClick(e) { 
        if (this.activeFeature) {
            this.activeFeature = undefined;
            this.props.radio.vent.trigger('item:deactivate');
        }
    }


    /*
     * Returns feature corresponding to model.
     *
     */
    getFeatureByModel(model) {
        for (let feature of this.collection.features) {
            if (feature._model === model) { return feature; }
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
        var filter, valueIndeces, id;
        filter = this.props.project.get('data').filter
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15)
        if (!valueIndeces || valueIndeces.length === 0) { return; }
        if (valueIndeces.length === 1) {
            return this.colors.toRgb(valueIndeces[0]-1);
        }
        // Communicate with Comp.Setup.Component to create and retrieve stripe pattern id
        id = this.props.radio.reqres.request('get:pattern:id', valueIndeces);
        return `url(#stripe-pattern-${id})`;
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
        var bounds = path.bounds(geoJson),
            topLeft, bottomRight;
        if (!this._areBoundsFinite(bounds)) { return; }
        bounds[0][0] -= extraExpansion;
        bounds[0][1] -= extraExpansion;
        bounds[1][0] += extraExpansion;
        bounds[1][1] += extraExpansion;
        topLeft = bounds[0];
        bottomRight = bounds[1];
        this.svg.attr({ 'width': bottomRight[0] - topLeft[0], 'height': bottomRight[1] - topLeft[1] + 50 });
        this.svg.style({ 'left': topLeft[0] + 'px', 'top': topLeft[1] + 'px' });
        this.g.attr("transform", `translate(${-topLeft[0]},${-topLeft[1]})`);
        return this;
    }


    /*
     * Destroy overlay view along with all event listeners.
     *
     */
    destroy() {
        if (this.stopListening)
            this.stopListening();
        this.g.selectAll('path').remove();
        this.g.remove();
        this.svg.remove();
        return this;
    }

}

export default BaseOverlayView;