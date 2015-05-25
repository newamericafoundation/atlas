describe 'Atlas.CSS', ->

	describe 'ClassBuilder', ->

		describe '#interpolate()', ->

			it 'defaults to 15 items', ->
				expect(Atlas.CSS.ClassBuilder.interpolate(2, 3)).toBe 8

			it 'interpolates with specified color count', ->
				expect(Atlas.CSS.ClassBuilder.interpolate(2, 3, 5)).toBe 3
				expect(Atlas.CSS.ClassBuilder.interpolate(3, 4, 7)).toBe 5
				expect(Atlas.CSS.ClassBuilder.interpolate(2, 3, 4)).toBe 3