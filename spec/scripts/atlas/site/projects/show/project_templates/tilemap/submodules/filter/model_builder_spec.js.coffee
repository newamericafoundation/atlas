describe 'Filter.modelBuilder', ->

	F = Atlas.Projects.Show.Tilemap.Filter

	describe 'buildNumericalFilter', ->

		it 'builds filter including +/- infinity values if leading and trailing delimiter marks are present', ->
			expect(F.buildNumericalFilter('|100|200|300|')).toEqual [
				{ min: -1000000, max: 100, value: 'Less than 100' }
				{ min: 100, max: 200, value: 'Between 100 and 200' }
				{ min: 200, max: 300, value: 'Between 200 and 300' } 
				{ min: 300, max: +1000000, value: 'Greater than 300' }
			]

		it 'builds filter including - infinity values if only leading delimiter mark is present', ->
			expect(F.buildNumericalFilter('|100|200|300')).toEqual [
				{ min: -1000000, max: 100, value: 'Less than 100' }
				{ min: 100, max: 200, value: 'Between 100 and 200' }
				{ min: 200, max: 300, value: 'Between 200 and 300' } 
			]

		it 'builds filter including + infinity values if only trailing delimiter mark is present', ->
			expect(F.buildNumericalFilter('100|200|300|')).toEqual [
				{ min: 100, max: 200, value: 'Between 100 and 200' }
				{ min: 200, max: 300, value: 'Between 200 and 300' } 
				{ min: 300, max: +1000000, value: 'Greater than 300' }
			]