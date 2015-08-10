$.fn.extend
	# Toggles modifier class.
	# @param {string} baseClass
	# @param {array} modifiers - Array of modifiers to be toggled in sequence.
	# @param {string} modifierSign - String separating baseclass from modifier. Defaults to '--' (BEM).
	toggleModifierClass: (baseClass, modifiers, modifierSign = '--') ->
		$el = $(@)
		# convert modifiers to array if not already an array
		modifiers = modifiers[0] unless (modifiers instanceof Array)

		for modifier, i in modifiers
			className = baseClass + modifierSign + modifier
			if $el.hasClass(className)
				$el.removeClass(className)
				newModifier = (if modifiers[i + 1]? then modifiers[i + 1] else modifiers[0])
				# Only add new modifier if not the same.
				if (newModifier isnt modifier) and (newModifier isnt '')
					newClass = baseClass + modifierSign + newModifier
					return $el.addClass newClass

		# If no class was found, add the first one.
		$el.addClass(baseClass + modifierSign + modifiers[0])