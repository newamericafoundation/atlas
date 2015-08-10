Comp.Projects.Show.Explainer.Related = React.createClass

	displayName: 'Projects.Show.Explainer.Related'

	render: ->
		<div className="atl__related">
			<p>Related Pages</p>
			<ul>
				{ @renderList() }
			</ul>
		</div>

	renderList: ->
		relatedItems = @props.related
		return unless relatedItems?
		relatedItems.map (item, i) ->
			<li key={'related-' + i}>
				<Comp.Projects.Show.Explainer.Related.Item relatedItem={item} />
			</li>


Comp.Projects.Show.Explainer.Related.Item = React.createClass

	displayName: 'Projects.Show.Explainer.Related.Item'

	render: ->
		item = @props.relatedItem
		<a className="link" href={"/" + item.get('atlas_url')} onClick={@navigate}>{item.get('title')}</a>

	navigate: (e) ->
		# e.preventDefault()
		# item = @props.relatedItem
		# Backbone.history.navigate ("/" + item.get('atlas_url')), { trigger: true }