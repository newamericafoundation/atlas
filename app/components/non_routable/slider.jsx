// var Slider = function(options) {

//     var self = {},
//         $sliderEl = $(options.selector); // Set slider id dynamically, define in options when invoking module

//     /** Set active data point */
//     self.activeDataPoint = options.value || options.max;

//     /** Mix Backbone.Events module into self object to trigger custom events */
//     if (_ && Backbone) {
//        _.extend(self, Backbone.Events);
//     }

//     /** Check that slider orientation is set to one of two allowed options, if not default to horizontal 
//      * Todo: currently, need to swap css file path in index.html to change orientation successfully, handle better */
//     var setOrientation = function() {
//         if (['horizontal', 'vertical'].indexOf(options.orientation) > -1) {
//             self.orientation = options.orientation;
//         } else {
//             self.orientation = 'horizontal'; 
//         }
//     };

//     setOrientation();

//     /** Draw slider based on data */
//     self.create = function() {
//         var $tooltip = $('<div id=' + options.tooltipId + '><div>');
        
//         /** Create the slider */
//         $sliderEl.slider({
//             orientation: self.orientation,
//             value: options.value || options.max,
//             min: options.min,
//             max: options.max,
//             step: options.step,
//             slide: function(event, ui) {
//                 $tooltip.text(ui.value);
                                
//                 * Check if this is equal to previous active data point. If yes, trigger custom change event 
//                 if (ui.value !== self.activeDataPoint) {
//                     self.trigger('change', ui.value);
//                 }

//                 /* Set current active data point to slider handle value */
//                 self.activeDataPoint = ui.value;
//             }
//         });

//         /** Show tooltip text before first slide event activated */
//         $sliderEl.find(".ui-slider-handle")
//             .append($tooltip.text($sliderEl.slider('value')))
//             .show();
//     };

//     /** Check that update paramaters are set to allowed options, if not then set to null and do not update 
//      * Todo: add additional value checks. Ex: if I set a new min, is it greater than the current max? */
//     var setUpdateParam = function() {
//         if(['value', 'min', 'max', 'step'].indexOf(options.updateParam) > -1) {
//             self.updateParam = options.updateParam;
//             self.updateValue = options.updateValue;
//         } else {
//             self.updateParam = null;
//             self.updateValue = null;
//         }
//     };

//     setUpdateParam();

//     /** Update slider value for a specific param and adjust subdivisions */
//     self.update = function(options) {
//         $sliderEl.slider( 'option', options.updateParam, options.updateValue);
//     };

//     /** Wipe out event listeners and take off dom elements */
//     self.destroy = function() {
//         $sliderEl.unbind().remove();
//         $("#box").unbind().remove();
//     };

//     return self;
// };


Comp.Slider = class extends React.Component {

    render() {
        return (
            <div className='atl__slider' ref='root'>
            </div>
        );
    }

    componentDidMount() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.slider({

        });
    }

    componentWillUnmount() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.unbind();
    }

}