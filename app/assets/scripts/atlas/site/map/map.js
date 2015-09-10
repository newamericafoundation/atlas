this.Atlas.module('Map', function(Map) {

    this.startWithParent = false;

    this.on('start', function() {
        return this.Controller.show();
    });

    this.on('stop', function() {
        return this.Controller.destroy();
    });

    Map.Controller = {

        show: function() {
            return $().ensureScript('L', '/assets/vendor/mapbox.js', this.showMain.bind(this));
        },

        showMain: function() {
            Map.rootView = new Map.RootView().render();
            this.$loading = $("<div class='loading-icon'><div>Loading...</div></div>");
            $('.atl__main').append(this.$loading);
            return $().ensureScript('d3', '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
        },

        showOverlay: function() {
            var View, itemType, items, launch;
            items = Map.props.project.get('data').items;
            itemType = items.getItemType();
            if (itemType === 'state') {
                View = Map.PathOverlayView;
            } else {
                View = Map.PindropOverlayView;
            }
            launch = function(baseGeoData) {
                var coll;
                coll = items.getRichGeoJson(baseGeoData);
                return coll.onReady(function() {
                    var overlayView;
                    overlayView = new View();
                    overlayView.map = Map.map;
                    overlayView.collection = coll;
                    Map.overlayView = overlayView;
                    return overlayView.render();
                });
            };
            this.getStateBaseGeoData(launch);
            return this;
        },

        getStateBaseGeoData: function(next) {
            var data;
            data = Map.props.App['us-states-10m'];
            if (data != null) {
                return next(data);
            }
            return $.ajax({
                url: '/data/us-states-10m.js',
                dataType: 'script',
                success: function() {
                    return next(Map.props.App['us-states-10m']);
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

});