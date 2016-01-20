import React from 'react'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'

/*
 *
 *
 */
class Slider extends React.Component {

    /*
     *
     *
     */
    constructor(props) {
        super(props)
        this.state = {
            valueIndex: 1
        }
    }


    /*
     *
     *
     */
    render() {
        return (
            <div className='atl__slider' ref='root'>
            </div>
        )
    }


    /*
     *
     *
     */
    componentDidMount() {
        this.buildSlider()
    }


    /*
     *
     *
     */
    componentWillUnmount() {
        this.destroySlider()
    }


    /*
     *
     *
     */
    componentDidUpdate() {
        this.setSliderValueText()
    }


    /*
     *
     *
     */
    buildSlider() {
        var $el = $(ReactDOM.findDOMNode(this.refs.root))
        $el.slider({
            value: this.state.valueIndex,
            min: 0,
            max: this.props.values.length - 1,
            step: 1,
            slide: (e, ui) => {
                this.setState({ valueIndex: ui.value });
                this.props.setUiState({ specifier: this.getSliderValueText() });
            }
        })
        this.setSliderValueText()
    }


    /*
     *
     *
     */
    destroySlider() {
        var $el = $(findDOMNode(this.refs.root))
        $el.unbind()
    }


    /*
     *
     *
     */
    setSliderValueText() {
        var $el = $(findDOMNode(this.refs.root))
        $el.find('span').html(this.getSliderValueText())
    }


    /*
     *
     *
     */
    getSliderValueText() {
        return this.props.values[this.state.valueIndex]
    }

}

export default Slider