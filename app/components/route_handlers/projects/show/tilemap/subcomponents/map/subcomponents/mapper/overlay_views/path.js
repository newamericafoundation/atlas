import $ from 'jquery';

import BaseOverlayView from './base.js';

class PathOverlayView extends BaseOverlayView {

    /*
     * Brings feature to the top so its stroke is not covered by non-highlighted paths.
     */
    bringFeatureToFront(feature) {
        this.g.selectAll('path').sort((a, b) => {
            if (a.id !== feature.id) { return -1; }
            return +1;
        });
    }


    /*
     * Backbone-like render method.
     *
     */
    render() {
        this.renderSvgContainer();
        this.geoJson = this.collection;
        this.g.selectAll('path')
            .data(this.geoJson.features)
            .enter()
            .append('path')
            .on('mouseover', this.onFeatureMouseOver.bind(this))
            .on('mouseout', this.onFeatureMouseOut.bind(this))
            .on('click', (d) => {
                if (d3.event.defaultPrevented) { return; }
                this.onFeatureClick(d);
            });
        this.update();
        // TODO - move into a common onShow method
        this.onRender();
        this.setMapEventListeners();
        return this;
    }


    /*
     * Get projected point.
     * @param {number} long
     * @param {number} lat
     * @returns {object}
     */
    getProjectedPoint(long, lat) {
        this.map.latLngToLayerPoint(new L.LatLng(lat, long));
    }


    /*
     * Get transform path based on Leaflet map.
     * @param {array} latLongScaleOrigin
     * @param {array} latLongPosition
     * @returns {function} path
     */
    getPath(latLongOriginCenter, latLongDestinationCenter, scale) {

        var self = this, 
            transform, path;

        var projectPoint = function(long, lat) {

            var point = self.latLongToModifiedLayerPoint([ lat, long ], {
                latLongOriginCenter: latLongOriginCenter,
                latLongDestinationCenter: latLongDestinationCenter,
                scale: scale
            });

            this.stream.point(point.x, point.y);
            return this;

        }

        transform = d3.geo.transform({ point: projectPoint });
        path = d3.geo.path().projection(transform);

        return path;

    }


    /*
     * Get scale and centroid modifiers that position Alaska, Hawaii and DC in a visible format.
     *
     */
    getUsStateProjectionModifiers(usStateId) {
        var usStateLatLongCentroids = {
            '2': {
                latLongScaleOrigin: [ 65.4169289, -153.4474854 ],
                latLongPosition: [ 30.2065372,-134.6754338 ],
                scale: 0.2
            },
            '15': {
                latLongScaleOrigin: [ 20.8031863,-157.6043485 ],
                latLongPosition: [  ],
                scale: 1
            },
            '11': {
                latLongScaleOrigin: [ 38.9093905,-77.0328359 ],
                latLongPosition: [ 32.0680227,-70.8874945 ],
                scale: 15
            }
        };
    }


    getModifiedUsStatePath(usStateId) {
        
    }


    /*
     * Apply transform and classes on paths.
     *
     */
    update() {
        var path = this.getPath(),
            geoJson = this.collection;
        this.g.selectAll('path')
            .attr({
                'class': (feature) => {
                    var displayState = this.getFeatureDisplayState(feature);
                    var cls = 'map-region map-region__element';
                    if (displayState) {
                        cls += ` map-region--${displayState}`;
                    }
                    return cls;
                },
                'd': (feature) => {
                    // access embedded Backbone model
                    var model = feature._model;
                    // if (model && (model.get('_itemType') === 'us_state') && (model.get('id') === 2)) {
                    //     return this.getPath([ 65.4169289, -153.4474854 ], [ 30.2065372, -134.6754338 ], 0.2)(feature);
                    // }
                    // if (model && (model.get('_itemType') === 'us_state') && (model.get('id') === 11)) {
                    //     return this.getPath([ 38.9093905, -77.0328359 ], [ 32.0680227, -70.8874945 ], 15)(feature);
                    // }
                    return path(feature);
                },
                'fill': this.getFill.bind(this)
            });
        this.resizeContainer(geoJson, path, 0);
        return this;
    }

}

export default PathOverlayView;