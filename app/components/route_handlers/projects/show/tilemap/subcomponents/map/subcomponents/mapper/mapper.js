import $ from 'jquery';

import RootView from './root_view.js';

import PinOverlayView from './overlay_views/pin.js';
import PathOverlayView from './overlay_views/path.js';

import shapeFile from './../../../../../../../../../models/shape_file.js';

var Mapper = {};

Mapper.start = function() {
    return this.Controller.show();
};

Mapper.stop = function() {
    return this.Controller.destroy();
};

Mapper.Controller = {

    /*
     *
     *
     */
    show: function() {
        return $().ensureScript('L', '/assets/vendor/mapbox.js', this.showMain.bind(this));
    },


    /*
     *
     *
     */
    showMain: function() {

        var rootView = new RootView({ el: '#atl__map' });

        rootView.props = Mapper.props;

        Mapper.rootView = rootView;
        rootView.render();

        this.$loading = $("<div class='loader'><img src='/assets/images/spinner.gif'></div>");
        $('.atl__main').append(this.$loading);
        
        return $().ensureScript('d3', '/assets/vendor/d3.min.js', this.showOverlay.bind(this));

    },


    /*
     *
     *
     */
    showOverlay: function() {

        var View, itemType, items, launch;
        items = Mapper.props.project.get('data').items;
        itemType = items.getItemType();

        var OverlayView = this.getOverlayViewConstructor(itemType);

        launch = function(baseGeoData) {

            var coll;

            coll = items.getRichGeoJson(baseGeoData);

            return coll.onReady(function() {
                var overlayView = new OverlayView({
                    map: Mapper.rootView.map,
                    collection: coll,
                    props: Mapper.props,
                    colors: Mapper.colors,
                    svgPaths: Mapper.svgPaths
                });
                Mapper.overlayView = overlayView;
                return overlayView.render();
            });

        };

        if (itemType === 'pin') {
            launch();
            return this;
        }

        var shps = new shapeFile.Collection();

        var shp = shps.findWhere({
            name: `${itemType}s`
        });

        shp.getGeoJsonFetchPromise().then((data) => {
            console.log(data);
            launch(data);
        }).catch((err) => { console.log(err); });

        return this;

    },


    /*
     *
     *
     */
    getOverlayViewConstructor: function(itemType) {
        if (itemType === 'pin') { return PinOverlayView; }
        return PathOverlayView;
    },


    /*
     *
     *
     */
    destroy: function() {
        if (Mapper.overlayView) { Mapper.overlayView.destroy(); }
        if (Mapper.rootView) { return Mapper.rootView.destroy(); }
    }

};

export default Mapper;