describe 'Atlas.Util.parsers', ->

	parsers = Atlas.Util.parsers

	describe 'removeArrayWrapper', ->

		it 'builds model correctly if its data is wrapper in array brackets', ->
			resp = [ { key: 'value' } ]
			parsedResp = { key: 'value' }
			(parsers.removeArrayWrapper(resp)).should.eql parsedResp


	describe 'adaptMongoId', ->

		it 'extracts model id from mongoid $oid form', ->
			resp = { id: { $oid: '1234' } }
			parsedResp = { id: '1234' }
			(parsers.adaptMongoId(resp)).should.eql parsedResp