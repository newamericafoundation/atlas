describe 'Atlas.CSS', ->

	describe 'ClassBuilder', ->

		describe '#interpolate()', ->

			it 'defaults to 15 items', ->
				Atlas.CSS.ClassBuilder.interpolate(2, 3).should.equal 8

			it 'interpolates with specified color count', ->
				Atlas.CSS.ClassBuilder.interpolate(2, 3, 5).should.equal 3
				Atlas.CSS.ClassBuilder.interpolate(3, 4, 7).should.equal 5
				Atlas.CSS.ClassBuilder.interpolate(2, 3, 4).should.equal 3