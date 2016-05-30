import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { receiveValue } from '../../actions';
import style from './Counter.css';
import { Spinner } from '../';


class Counter extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        let getNumber = () => {
            axios.get('/counter').then(response => {
               this.props.onReceive(response.data.number);
                setTimeout(getNumber, 1000 * 5); // REPEAT THIS EVERy 5 SECONDS
            });

        }

        setTimeout(getNumber, 1000);

    }

    render() {

        const number = (
            <div className={style.number} ref={ ref => { this.element = ref } }>
                {this.props.value}
            </div>
        );

        const spinner = (
            <Spinner/>    
        );

        return (
            <div className={style.container} onClick={this.onClick}>
                <div className={style.center}>
                    { (this.props.value == -1) ? spinner : number }
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        this.element.classList.remove(style.bounce);
        this.element.offsetWidth; // Triggers reflow; enables restart animation
        this.element.classList.add(style.bounce);
    }

    onClick() {
        axios.post('/counter').then(response => {
            this.props.onReceive(response.data.number);
        });
    }
}


const mapStateToProps = (state) => {
    return {
        value: state.value
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onReceive: (value) => {
            dispatch(receiveValue(value));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
