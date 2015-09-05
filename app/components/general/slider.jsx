import React form 'react';

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            valueIndex: 1
        };
    }

    render() {
        return (
            <div className='atl__slider' ref='root'>
            </div>
        );
    }

    componentDidMount() {
        this.buildSlider();
    }

    componentWillUnmount() {
        this.destroySlider();
    }

    componentDidUpdate() {
        this.setSliderValueText();
    }

    buildSlider() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.slider({
            value: this.state.valueIndex,
            min: 0,
            max: this.props.values.length - 1,
            step: 1,
            slide: (e, ui) => {
                this.setState({ valueIndex: ui.value });
                this.props.setUiState({ currentSpecifier: this.getSliderValueText() });
            }
        });
        this.setSliderValueText();
    }

    destroySlider() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.unbind();
    }

    setSliderValueText() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.find('span').html(this.getSliderValueText());
    }

    getSliderValueText() {
        return this.props.values[this.state.valueIndex];
    }

    componentWillUnmount() {
        var $el = $(React.findDOMNode(this.refs.root));
        $el.unbind();
    }

}

export default Slider;