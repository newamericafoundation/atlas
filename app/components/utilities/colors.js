import _ from 'underscore'

export default {

    _list: [
        [133, 2, 106],
        [138, 1, 135],
        [140, 2, 165],
        [129, 10, 166],
        [118, 18, 167],
        [106, 23, 167],
        [93, 43, 171],
        [79, 56, 173],
        [77, 72, 177],
        [73, 87, 182],
        [67, 102, 186],
        [58, 116, 191],
        [44, 130, 195],
        [11, 144, 199],
        [50, 161, 217]
    ],

    _hash: {},

    get: function(index) {
        return this._list[index]
    },

    interpolate: function(f) {
        var first, interpolated, last;
        first = this._list[0];
        last = this._list[this._list.length - 1];
        interpolated = [ 0, 1, 2 ].map((i) => Math.round(first[i] * f + last[i] * (1 - f)))
        return `rgba(${interpolated.join(',')}, 1)`
    },

    interpolateRgb: function(f) {
        var first, interpolated, last;
        first = this._list[0];
        last = this._list[this._list.length - 1];
        interpolated = [];
        interpolated.push(Math.round(first[0] * f + last[0] * (1 - f)));
        interpolated.push(Math.round(first[1] * f + last[1] * (1 - f)));
        interpolated.push(Math.round(first[2] * f + last[2] * (1 - f)));
        return "rgb(" + (interpolated.join(',')) + ")";
    },

    toRgba: function(index, opacity = 1) {
        if ((index != null) && this.get(index)) {
            return `rgba(${this.get(index).join(',')}, ${opacity})`
        }
    },

    toRgb: function(index) {
        if ((index != null) && this.get(index)) {
            return `rgb(${this.get(index).join(',')})`;
        }
    }

}