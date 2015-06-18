$.fn.extend
	changeModifierClass: (baseClass, previousModifier, newModifier, modifierIndicator = '--') ->
		$el = $(@)
		previousCls = baseClass + modifierIndicator + previousModifier
		newCls = baseClass + modifierIndicator + newModifier
		if previousModifier?
			if $el.hasClass previousCls
				$el.removeClass previousCls
		$el.addClass newCls