(function() {
  Comp.About = React.createClass({
    render: function() {
      return React.createElement("div", {
        "className": "about"
      }, React.createElement("h1", {
        "class": "title"
      }, "About Atlas"));
    }
  });

}).call(this);
