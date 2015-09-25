window.Map = {};

(function(Map) {

    Map.start = function() {
        return this.Controller.show();
    };

    Map.stop = function() {
        return this.Controller.destroy();
    };

    Map.Controller = {

        show: function() {
            return $().ensureScript('L', '/assets/vendor/mapbox.js', this.showMain.bind(this));
        },

        showMain: function() {
            Map.rootView = new Map.RootView({ el: '#atl__map' }).render();
            this.$loading = $("<div class='loader'><img src='/assets/images/spinner.gif'></div>");
            $('.atl__main').append(this.$loading);
            return $().ensureScript('d3', '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
        },

        showOverlay: function() {

            var View, itemType, items, launch;
            items = Map.props.project.get('data').items;
            itemType = items.getItemType();

            var OverlayView = this.getOverlayViewConstructor(itemType);

            launch = function(baseGeoData) {

                var coll;

                coll = items.getRichGeoJson(baseGeoData);

                return coll.onReady(function() {
                    var overlayView = new OverlayView({
                        map: Map.map,
                        collection: coll
                    });
                    Map.overlayView = overlayView;
                    return overlayView.render();
                });

            };

            if (itemType === 'pin') {
                launch();
                return this;
            }

            console.log(itemType);

            var shp = new M.shapeFile.Collection().findWhere({ name: `${itemType}s` });

            shp.getClientFetchPromise().then((data) => {
                launch(data);
            });

            return this;

        },

        getOverlayViewConstructor: function(itemType) {

            if (itemType === 'pin') { return Map.PinOverlayView; }
            return Map.PathOverlayView;

        },

        destroy: function() {
            if (Map.overlayView != null) {
                Map.overlayView.destroy();
            }
            if (Map.rootView != null) {
                return Map.rootView.destroy();
            }
        }
        
    };

} (window.Map));