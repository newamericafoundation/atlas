L.TopoJSON = L.GeoJSON.extend({

    addData: function(jsonData) {

        var key;

        if (jsonData.type === "Topology") {

            //for (key in jsonData.objects) {

                key = 'states';

                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);

            //}

        } else { // 

            L.GeoJSON.prototype.addData.call(this, jsonData);

        }

    }

});
// Copyright (c) 2013 Ryan Clark
