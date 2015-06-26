var React = require('react');

var Welcome = React.createClass({
    render: function() {
        return React.createElement("div", {
            "className": "welcome"
        }, React.createElement("div", {
            "id": "welcome__terrain",
            "className": "-id-welcome__terrain"
        }), React.createElement("div", {
            "className": "welcome__title"
        }, React.createElement("h1", {
            "className": "welcome__title__name"
        }, "ATLAS"), React.createElement("h1", {
            "className": "welcome__title__alias c-2-0"
        }, "=ANALYSIS")), React.createElement("div", {
            "className": "welcome__strip bg-c-2-0"
        }), React.createElement("div", {
            "className": "welcome__subtitle"
        }, "\t\t\t\tA policy analysis tool from New America\'s Education Program"), React.createElement(Welcome.Nav, {}));
    }
});

Welcome.Nav = React.createClass({

    render: function() {
        return React.createElement("div", {
            "className": "welcome__main-nav"
        }, React.createElement("a", {
            "href": "/menu",
            "className": "bg-img-grid--off-white",
            "id": "welcome__main-nav__button"
        }), React.createElement("p", {
            "className": "center"
        }, "View All Projects"));
    }
});

module.exports = Welcome;