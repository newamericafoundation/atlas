This innocent-looking line of code:

	unless 1 == 2 do
		puts "I can still make sense of math."
	end 

Will make your statement expect another end, which will much up the entire file. Best to go simple:

	unless 1 == 2
		puts "I can still make sense of math."
	end 