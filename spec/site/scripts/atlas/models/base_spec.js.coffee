describe 'Atlas.Models.BaseModel', ->

	Model = Atlas.Models.BaseModel
	model = new Model()

	describe 'adaptId', ->

		it 'replaces _id key with id if no $oid nesting is present', ->
			raw = { _id: 1 }
			expected = { id: 1 }
			actual = model._adaptMongoId(raw)
			actual.should.eql expected

		it 'if _id.$oid field exists, turns value into a string and moves it onto id. deletes _id', ->
			raw = { _id: { $oid: 1 } }
			expected = { id: '1' }
			actual = model._adaptMongoId(raw)
			actual.should.eql expected

		it 'if id.$oid field exists, turns value into a string and moves it onto id. deletes id.$oid', ->
			raw = { id: { $oid: 1 } }
			expected = { id: '1' }
			actual = model._adaptMongoId(raw)
			actual.should.eql expected