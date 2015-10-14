import $ from 'jquery';

import BaseOverlayView from './base.js';

class PathOverlayView extends BaseOverlayView {

    /*
     * Brings feature to the top so its stroke is not covered by non-highlighted paths.
     */
    bringFeatureToFront(feature) {
        this.g.selectAll('path').sort((a, b) => {
            if (a !== feature) { return -1; }
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
     * Get scale and centroid modifiers that position Alaska, Hawaii and DC in a visible format.
     *
     */
    getUsStateProjectionModifiers(usStateId) {
        return {
            '2': {
                latLongOriginCenter: [ 65.4169289, -153.4474854 ],
                latLongDestinationCenter: [ 30.2065372,-134.6754338 ],
                scale: 0.2
            },
            '15': {
                latLongOriginCenter: [ 20.8031863,-157.6043485 ],
                latLongDestinationCenter: [  ],
                scale: 1
            },
            '11': {
                latLongOriginCenter: [ 38.9093905,-77.0328359 ],
                latLongDestinationCenter: [ 32.0680227,-70.8874945 ],
                scale: 15
            }
        }[usStateId];
    }


    /*
     * Get options for D3 feature path generation.
     *
     */
    getFeaturePathOptions(feature) {
        // access embedded Backbone model
        var model = feature._model;
        // if (model && (model.get('_itemType') === 'us_state') && (model.get('id') === 2)) {
        //     return this.getUsStateProjectionModifiers('2');
        // }
        // if (model && (model.get('_itemType') === 'us_state') && (model.get('id') === 11)) {
        //     return this.getUsStateProjectionModifiers('11');
        // }
        return;
    }


    /*
     * Generate D3 feature path.
     *
     */
    getFeaturePath(feature) {
        var pathOptions = this.getFeaturePathOptions(feature);
        var path = this.getPath(pathOptions);
        return path(feature);
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
                'class': (feature) => { return this.getFeatureClassName.apply(this, [ feature, 'map-region' ]); },
                'd': this.getFeaturePath.bind(this),
                'fill': this.getFill.bind(this)
            });
        this.resizeContainer(geoJson, path, 0);
        return this;
    }

}

export default PathOverlayView;