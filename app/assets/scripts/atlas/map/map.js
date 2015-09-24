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

                console.log(baseGeoData);

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

            this.getStateBaseGeoData(launch);
            return this;

        },

        getOverlayViewConstructor: function(itemType) {

            if (itemType === 'state') { return Map.PathOverlayView; }
            return Map.PindropOverlayView;

        },

        getStateBaseGeoData: function(next) {

            var data;
            data = Atlas['us-states-10m'];
            if (data != null) {
                return next(data);
            }

            return $.ajax({
                url: '/data/us-states-10m.js',
                dataType: 'script',
                success: function() {
                    return next(Atlas['us-states-10m']);
                }
            });

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