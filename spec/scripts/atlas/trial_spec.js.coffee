describe 'test suite', ->

	it 'correctly loads fixtures', ->

		data = getJSONFixture 'fixture_load_test.json'
		expect(data.fixture_loaded).toEqual true