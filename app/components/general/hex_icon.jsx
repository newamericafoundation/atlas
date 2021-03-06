import React from 'react'

export default function HexIcon(props) {
	
	var { fillColor, className } = props
	var style = fillColor ? { fill: fillColor } : undefined

	return (
		<svg className={className} viewBox="0 0 100 100">
			<g className="hexicon__hex" style={style}>
				<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2
				L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>
			</g>
			<g className="hexicon__yes">
				<polygon points="70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5 	"/>
			</g>
			<g className="hexicon__no">
				<polygon points="72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2 
				57.8,50"/>
			</g>
		</svg>
	)

}