describe 'Atlas.Assets', ->

	describe 'svg', ->

		svg = Atlas.Assets.svg

		describe '_getPathNumbers', ->
			it 'extracts numbers as strings from svg path without minus signs, adding an empty string between two delimiters', ->
				svg._getPathNumbers("M50,50C-100,100").should.eql ['', '50', '50', '', '100', '100']

		describe '_getPathDelimiters', ->
			it 'extracts delimiters including minus signs from numbers', ->
				svg._getPathDelimiters("M50,50C-100,100").should.eql [ "M", ",", "C", "-", ","]

		describe '_moveMinusSigns', ->
			it 'moves minus signs from delimiters to numbers', ->
				delimiters = [ "M", ",", "C", "-", ","]
				numbers = ['', '50', '50', '', '100', '100']
				svg._moveMinusSigns delimiters, numbers
				(delimiters).should.eql [ "M", ",", "C", "", ","]
				(numbers).should.eql ['', '50', '50', '', '-100', '100']

		describe '_rebuild', ->
			it 'rebuilds svg path from delimiter and number arrays', ->
				delimiters = [ "M", ",", "C", "", ","]
				numbers = [NaN, '50', '50', NaN, '-100', '100']
				(svg._rebuild(delimiters, numbers)).should.eql "M50,50C-100,100"

		describe 'scalePath', ->
			it 'leaves path unchanged if scale factor is not provided', ->
				(svg.scalePath("M50,50C100,100")).should.eql("M50,50C100,100")

			it 'scales a simple path where the resulting coordinates are whole numbers', ->
				(svg.scalePath("M50,50C100,100", { scale: 0.5 })).should.eql("M25,25C50,50")

			it 'scales a simple path with three decimals accuracy', ->
				(svg.scalePath("M14,14C20,20", { scale: 0.0001 })).should.eql("M0.001,0.001C0.002,0.002")