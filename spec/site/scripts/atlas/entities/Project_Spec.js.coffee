describe 'Atlas.Entities.Project', ->

	model = undefined

	beforeEach ->
		model = new Atlas.Entities.ProjectModel()


	describe 'parse', ->

		it 'parses response data, making use of all sub-methods', ->
			resp = [ { template_name: 'Policy Brief', id: 5 } ]
			parsedResp = { template_name: 'PolicyBrief', id: 5 }
			model.parse(resp, 'numerical_data').should.eql parsedResp