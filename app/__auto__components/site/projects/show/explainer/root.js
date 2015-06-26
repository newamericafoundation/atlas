(function() {
  Comp.Projects.Show.Explainer = React.createClass({
    render: function() {
      return React.createElement("div", {
        "className": "fill-parent"
      }, React.createElement("div", {
        "className": "atl__title-bar atl__title-bar--solid bg-c-off-white"
      }, React.createElement("div", {
        "className": "atl__title-bar__background"
      }), React.createElement("div", {
        "className": "atl__title-bar__content"
      }, React.createElement("h1", {
        "className": 'title'
      }, this.props.model.get('title')), React.createElement("ul", null, React.createElement("li", null, "Updated: ", moment(this.props.model.get('updated_at')).format("MMMM Do YYYY"))))), React.createElement("div", {
        "className": "atl__content-bar bg-c-off-white"
      }, React.createElement("div", {
        "className": "atl-grid"
      }, React.createElement("div", {
        "className": "atl-grid__1-3"
      }, React.createElement("div", {
        "className": "atl__page-nav"
      }, React.createElement("div", {
        "className": "atl__toc"
      }, React.createElement("p", null, "Page Contents"), React.createElement("div", {
        "id": "atl__toc__list"
      }, React.createElement("div", {
        "className": "loading-icon"
      }, React.createElement("div", null)))))), React.createElement("div", {
        "className": "atl-grid__2-3"
      }, React.createElement("div", {
        "className": "static-content",
        "dangerouslySetInnerHTML": {
          __html: this.props.model.get('body_text')
        }
      }), React.createElement("div", {
        "id": "atl__related"
      }, React.createElement(Comp.Projects.Show.Explainer.RelatedPages, {
        "collection": this.props.collection
      }))), React.createElement("div", {
        "className": "atl-grid__3-3"
      }))));
    }
  });

  Comp.Projects.Show.Explainer.RelatedPages = React.createClass({
    getPages: function() {
      console.log(this.props.collection);
      return this.props.collection.map(function() {
        return React.createElement("li", null);
      });
    },
    render: function() {
      return React.createElement("div", null, React.createElement("p", null, "Related Pages"), React.createElement("ul", null, this.getPages()));
    }
  });

}).call(this);
