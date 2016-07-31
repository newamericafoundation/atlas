import React from 'react'

/*
 * Render a help text segment that displays when help is activated.
 * Parent needs to be relatively positioned for this to work.
 */
export default function Help(props) {

	var { id, text, position } = props
	position = position || 'left'
	var className = `atl__help atl__help--${position}`
	var idName = props.id ? `atl__help__${id}` : null
	return (
		<div className={ className } idName={ idName } >
			{ text }
		</div>
	)

}