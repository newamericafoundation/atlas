// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//

/*

~ Vendor Scripts ~
= require jquery

= require_tree ./vendor

= require jquery-ujs
= require ckeditor-jquery
= require marked/lib/marked
= require jquery-mousewheel/jquery.mousewheel
= require lodash/lodash
= require backbone/backbone
= require backbone-query-parameters/backbone.queryparams
= require marionette/lib/backbone.marionette
= require d3/d3
= require topojson
= require mapbox.js/mapbox.uncompressed
= require chartist/dist/chartist
= require numeral/numeral
= require microplugin/src/microplugin
= require sifter/sifter
= require moment/moment
= require selectize/dist/js/selectize

~ Vendor Script Developed With Atlas (use with caution) ~
= require accountant/dist/marionette.accountant
= require chartist-html/build/chartist-html

~ Vendor Script Custom Configurations ~
= require_tree ./config

~ Website Core - Main Layout, Router, Welcome Page, Index Page ~
= require 	   atlas/atlas
= require_tree ./atlas/routes
= require_tree ./atlas/base
= require_tree ./atlas/util
= require_tree ./atlas/templates
= require_tree ./atlas/components
= require_tree ./atlas/entities
= require_tree ./atlas/site

*/