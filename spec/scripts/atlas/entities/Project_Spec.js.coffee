describe 'Atlas.Entities.Project', ->

	model = undefined

	beforeEach ->
		model = new Atlas.Entities.ProjectModel()

	describe '_removeArrayWrapper', ->

		it 'builds model correctly if its data is wrapper in array brackets', ->
			resp = [ { key: 'value' } ]
			parsedResp = { key: 'value' }
			expect(model._removeArrayWrapper(resp)).toEqual parsedResp


	describe '_removeSpacesFromTemplateName', ->

		it 'removes white spaces from template name', ->
			resp = { template: { name: 'Policy Brief' } }
			parsedResp = { template: { name: 'PolicyBrief' } }
			expect(model._removeSpacesFromTemplateName(resp)).toEqual parsedResp


	describe '_adaptMongoId', ->

		it 'extracts model id from mongoid $oid form', ->
			resp = { id: { $oid: '1234' } }
			parsedResp = { id: '1234' }
			expect(model._adaptMongoId(resp)).toEqual parsedResp


	describe '_parseIntegerFields', ->

		it 'parses integer fields', ->
			resp = { numerical_data: "10" }
			parsedResp = { numerical_data: 10 }
			expect(model._parseIntegerFields(resp, [ 'numerical_data' ])).toEqual parsedResp


	describe 'parse', ->

		it 'parses response data, making use of all sub-methods', ->
			resp = [ { template: { name: 'Policy Brief' }, project_section_id: '10', id: { $oid: 5 } } ]
			parsedResp = { template: { name: 'PolicyBrief' }, project_section_id: 10, id: 5 }
			expect(model.parse(resp, 'numerical_data')).toEqual parsedResp