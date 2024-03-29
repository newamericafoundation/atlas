import BaseOverlayView from './base.js'

import colors from './../../../../../../../../../../utilities/colors.js'

import svgPaths from './svg_paths/pin.json'

/*
 *
 *
 */
class PinOverlayView extends BaseOverlayView {

    /*
     * Get map pin svg, including halves and thirds for multi-value match coloring.
     *
     */
    getShapes() {
        var { paths } = svgPaths.pindrop
        return [
            { path: paths.slice_1_of_2, className: 'map-pin__1-of-2' },
            { path: paths.slice_2_of_2,  className: 'map-pin__2-of-2' },
            { path: paths.slice_1_of_3, className: 'map-pin__1-of-3' },
            { path: paths.slice_2_of_3_a,  className: 'map-pin__2-of-3' },
            { path: paths.slice_2_of_3_b,  className: 'map-pin__2-of-3' },
            { path: paths.slice_3_of_3,  className: 'map-pin__3-of-3' }, 
            { path: paths.outer, className: 'map-pin__outer' },
            { path: paths.inner, className: 'map-pin__inner' }
        ]
    }


    /*
     *
     *
     */
    render() {

        this.renderSvgContainer()

        this.shape = svgPaths.pindrop

        // Get halves and thirds of the pin to apply corresponding coloring.
        var pindrop = this.getShapes()

        this.g.selectAll('g')
            .data(this.collection.features)
            .enter()
            .append('g')
            .attr({ 'class': 'map-pin'})
            .on('mouseover', this.onFeatureMouseOver.bind(this))
            .on('mouseout', this.onFeatureMouseOut.bind(this))
            .on('click', this.onFeatureClick.bind(this))
            .selectAll('path')
            .data(pindrop) 
            .enter()
            .append('path')
            .attr({
                'd'    : (d) => { return d.path; },
                'class': (d) => { return d.className; }
            });

        this.update();
        this.onRender();
        this.setMapEventListeners();
    }


    /*
     *
     *
     */
    getFills(feature) {
        var filter, valueIndeces;
        filter = this.props.project.get('data').filter;
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
        if (!valueIndeces || valueIndeces.length === 0) { return; }
        return valueIndeces.map((valueIndex) => {
            return colors.toRgb(valueIndex-1);
        });
    }


    /*
     *
     *
     */
    getFeatureTransform(feature) {
        var longLatPosition, pt;
        longLatPosition = feature.geometry.coordinates;

        pt = this.latLongToModifiedLayerPoint([ longLatPosition[1], longLatPosition[0] ], {
            pixelOffset: [ - this.shape.dim.width / 2, - this.shape.dim.height ],
            leafletConvertMethodName: 'latLngToLayerPoint'
        });

        return `translate(${pt.x},${pt.y})`;
    }


    /*
     *
     *
     */
    update() {

        var self = this;

        // Assuming a class name of the form .base__1-of-3, extracts numbers 1 and 3 in an array.
        // @returns {array}
        var getIndecesFromClassName = function(cls) {
            var indeces = cls.split('__')[1].split('-');
            if (indeces[2] != null) {
                indeces = [ parseInt(indeces[0], 10), parseInt(indeces[2], 10) ];
                return indeces;
            }
        }

        var path = this.getPath();

        this.g.selectAll('g')
            .attr({
                transform: this.getFeatureTransform.bind(this),
                class: (feature) => { return this.getFeatureClassName.apply(this, [ feature, 'map-pin' ]); }
            })
            .selectAll('path')
            .attr({
                'class': (d, i) => {
                    var baseClass = 'map-pin__element';
                    return d.className + ' ' + baseClass;
                },

                // These sub-paths hold halves and thirds of the entire pin so that their
                //   colors may be set dynamically based on how many color values need to be rendered.
                // This method gets the fill colors as well as the indeces (1-of-3 means the first third)
                //   and applies colors appropriately.
                // Logic is complicated and poorly factored.
                'fill': function(d, i) {
                    var parentFeature, colors, indeces;
                    parentFeature = d3.select(this.parentNode).datum();
                    colors = self.getFills(parentFeature);
                    if (!colors) { return 'none'; }
                    indeces = getIndecesFromClassName(d.className)
                    if (indeces) {
                        if (colors.length === 1) {
                            return colors[0];
                        }
                        if (((colors.length === 2) && (indeces[1] === 2)) || ((colors.length === 3) && (indeces[1] === 3)) || (colors.length > 3)) {
                            let colorIndex = indeces[0] - 1;
                            if (colors[colorIndex]) {
                                return colors[colorIndex];
                            }
                        }
                    }
                    return 'none';
                }
            });

        this.resizeContainer(this.collection, path, 100);

        return this;

    }

}

export default PinOverlayView