/*!
 * toc - jQuery Table of Contents Plugin v0.3.2
 * Removed event bindings.
*/

(function($) {
var verboseIdCache = {};
$.fn.toc = function(options) {
  var self = this;
  var opts = $.extend({}, jQuery.fn.toc.defaults, options);

  var container = $(opts.container);
  var headings = $(opts.selectors, container);
  var headingOffsets = [];

  return this.each(function() {
    //build TOC
    var el = $(this);
    var ul = $(opts.listType);

    headings.each(function(i, heading) {
      var $h = $(heading);
      headingOffsets.push($h.offset().top - opts.highlightOffset);

      var anchorName = opts.anchorName(i, heading, opts.prefix);

      var tagName = $h.prop('tagName').toLowerCase();

      var text = opts.headerText(i, heading, $h);

      var templateFunction;

      if (opts.templates) {
        templateFunction = opts.templates[tagName];
        if (templateFunction) {
          text = templateFunction({ title: text });
        }
      }

      //add anchor
      if(heading.id !== anchorName) {
        var anchor = $('<span/>').attr('id', anchorName).insertBefore($h);
      }

      //build TOC item
      var a = $('<a/>')
        .html(text)
        .attr('href', '#' + anchorName);

      var li = $('<li/>')
        .addClass(opts.itemClass(i, heading, $h, opts.prefix))
        .append(a);

      ul.append(li);

    });

    el.html(ul);

  });

};


jQuery.fn.toc.defaults = {
  container: 'body',
  listType: '<ul/>',
  selectors: 'h1,h2,h3',
  prefix: 'toc',
  anchorName: function(i, heading, prefix) {
    if(heading.id.length) {
      return heading.id;
    }

    var candidateId = $(heading).text().replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();
    if (verboseIdCache[candidateId]) {
      var j = 2;
      
      while(verboseIdCache[candidateId + j]) {
        j++;
      }
      candidateId = candidateId + '-' + j;
      
    }
    verboseIdCache[candidateId] = true;

    return prefix + '-' + candidateId;
  },
  headerText: function(i, heading, $heading) {
    return $heading.data('toc-title') || $heading.text();
  },
  itemClass: function(i, heading, $heading, prefix) {
    return prefix + '-' + $heading[0].tagName.toLowerCase();
  }

};

})(jQuery);