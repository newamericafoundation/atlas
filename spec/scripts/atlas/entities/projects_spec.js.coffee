describe 'Atlas.Entities.ProjectCollection', ->

	Coll = Atlas.Entities.ProjectCollection

	describe '#comparator', ->

		modelData1 = undefined
		modelData2 = undefined
		modelData3 = undefined
		modelData4 = undefined

		beforeEach ->
			modelData1 = 
				id: 1
				title: 'C.'
				is_section_overview: 'Yes'

			modelData2 = 
				id: 2
				title: 'B.'
				is_section_overview: 'Yes'

			modelData3 = 
				id: 3
				title: 'Xtitla'
				is_section_overview: 'No'

			modelData4 =
				id: 4
				title: 'Xtitl.'
				is_section_overview: 'No'

		it 'if both (or neither) are section overviews (:is_section_overview), sort by :title', ->
			coll = new Coll [modelData1, modelData2]
			expect(coll.models[0].get('id')).toBe 2

		it 'if one is a section overview and the other is not, the section overview comes first regardless of the title', ->
			coll = new Coll [modelData2, modelData1]
			expect(coll.models[0].get('id')).toBe 2

		it 'passes integration test for three models', ->
			coll = new Coll [modelData1, modelData2, modelData3, modelData4]
			expect(coll.models[0].get('id')).toBe 2
			expect(coll.models[1].get('id')).toBe 1
			expect(coll.models[2].get('id')).toBe 4
			expect(coll.models[3].get('id')).toBe 3