describe 'toggleModifierClass', ->

	$el1 = $("<div class='base--modifier1'></div>")
	$el2 = $("<div class='base--modifier2'></div>")
	$el0 = $("<div'></div>")

	it 'removes current modifier and adds next one', ->
		$el = $("<div class='base--modifier1'></div>")
		$el.toggleModifierClass('base', [ 'modifier1', 'modifier2' ], '--')
		$el.attr('class').should.equal 'base--modifier2'

	it 'wraps around list of modifiers', ->
		$el = $("<div class='base--modifier2'></div>")
		$el.toggleModifierClass('base', [ 'modifier1', 'modifier2' ], '--')
		$el.attr('class').should.equal 'base--modifier1'

	it 'adds first modifier if none found', ->
		$el = $("<div></div>")
		$el.toggleModifierClass('base', [ 'modifier1', 'modifier2' ], '--')
		$el.attr('class').should.equal 'base--modifier1'