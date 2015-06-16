describe 'Atlas.Util.templateHelpers', ->

	describe '#addDashOnLongWords()', ->

		fn = Atlas.Util.templateHelpers.addDashOnLongWord

		it 'returns argument if it is null or undefined', ->
			(fn(undefined)?).should.equal false
			(fn(null)?).should.equal false

		it 'returns string when only short words are present', ->
			fn('straw').should.equal 'straw'

		it 'adds hyphen after third to last character', ->
			fn('strawberries').should.equal 'strawber-ries'