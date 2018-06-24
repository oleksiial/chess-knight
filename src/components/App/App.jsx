import './App.css';
import React, { Component } from 'react';
import Canvas from '../Canvas/Canvas';
import { connect } from 'react-redux';
import { nextMove, setPosition, run, stop, prevMove, redo } from '../../redux/actions/core';
import PropTypes from 'prop-types';

const propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	field: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
	knight: PropTypes.shape({
		i: PropTypes.number.isRequired,
		j: PropTypes.number.isRequired
	}).isRequired,
	journal: PropTypes.arrayOf(PropTypes.shape({
		field: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
		knight: PropTypes.shape({
			i: PropTypes.number.isRequired,
			j: PropTypes.number.isRequired
		}).isRequired
	})).isRequired,
	undo: PropTypes.number.isRequired,

	setPosition: PropTypes.func.isRequired,
	nextMove: PropTypes.func.isRequired,
	run: PropTypes.func.isRequired,
	stop: PropTypes.func.isRequired,
	prevMove: PropTypes.func.isRequired,
	redo: PropTypes.func.isRequired
};

class App extends Component {
	componentDidMount () {
		this.props.setPosition(0, 0);
	}

	onClickNextMove = () => {
		const {width, height, field, knight} = this.props;
		this.props.nextMove(width, height, field, knight);
	}

	render() {
		return (
			<div className="app">
				<header>
					<span>Some fancy header</span>
					<button onClick={this.onClickNextMove}>next move</button>
					<button onClick={this.props.prevMove}>prev move</button>
					<button onClick={this.props.redo}>redo</button>
					<button onClick={this.props.run}>run</button>
					<button onClick={this.props.stop}>stop</button>
				</header>
				<Canvas
					width={this.props.width}
					height={this.props.height}
					journal={
						this.props.journal.slice(0, this.props.journal.length - this.props.undo)
					}
				/>
			</div>
		);
	}
}

App.propTypes = propTypes;

const mapStateToProps = (state) => {
	return {
		width: state.core.width,
		height: state.core.height,
		field: state.core.field,
		knight: state.core.knight,
		journal: state.core.journal,
		undo: state.core.undo
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		nextMove: (width, height, field, knight) => dispatch(nextMove(width, height, field, knight)),
		prevMove: () => dispatch(prevMove()),
		setPosition: (i, j) => dispatch(setPosition(i, j)),
		run: () => dispatch(run()),
		stop: () => dispatch(stop()),
		redo: () => dispatch(redo())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
