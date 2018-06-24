import {
	SET_POSITION,
	NEXT_MOVE,
	getDirections,
	RUN,
	STOP,
	PREV_MOVE,
	REDO
} from '../actions/core';

const initialWidth = 50;
const initialHeight = 50;

const initialState = {
	width: initialWidth,
	height: initialHeight,
	field: initializeField(initialWidth, initialHeight),
	knight: { i: -1, j: -1 },
	isRunning: false,
	journal: [{
		field: initializeField(initialWidth, initialHeight),
		knight: { i: -1, j: -1 }
	}],
	undo: 0
};

export default function(state = initialState, action) {
	switch (action.type) {
	case SET_POSITION: {
		const knight = { i: action.payload.i, j: action.payload.j };
		const field = updateField(state.width, state.height, state.field, knight);
		return {
			...initialState,
			field: field,
			knight: knight,
			journal: [{ field: field, knight: knight }]
		};
	}
	case RUN:
		return { ...state, isRunning: true };
	case STOP:
		return { ...state, isRunning: false };
	case NEXT_MOVE: {
		const knight = { i: action.payload.i, j: action.payload.j };
		const field = updateField(state.width, state.height, state.field, knight);
		return {
			...state,
			field: field,
			knight: knight,
			journal: [
				...state.journal.slice(0, state.journal.length - state.undo),
				{ field: field, knight: knight }
			],
			undo: 0
		};
	}
	case PREV_MOVE: {
		const prevState = state.journal[state.journal.length - state.undo - 2];
		if (prevState === undefined) {
			return state;
		}
		return {
			...state,
			field: prevState.field,
			knight: prevState.knight,
			undo: state.undo + 1
		};
	}
	case REDO: {
		if (state.undo === 0) {
			return state;
		}
		const { field, knight } = state.journal[state.journal.length - state.undo];
		return {
			...state,
			field: field,
			knight: knight,
			undo: Math.max(0, state.undo - 1)
		};
	}
	default:
		return state;
	}
}

function initializeField(width, height) {
	const field = Array(height).fill(null).map(() => Array(width).fill(null));
	return field.map((sub, i) =>
		sub.map((v, j) => {
			const directions = getDirections(i, j);
			let count = 0;
			for (const d of directions) {
				if (d[0] >= 0 && d[0] < height && d[1] >= 0 && d[1] < width) {
					count++;
				}
			}
			return count;
		})
	);
}

function updateField(width, height, field, knight) {
	const directions = getDirections(knight.i, knight.j);
	field[knight.i][knight.j] = 9;
	for (const d of directions) {
		if (d[0] >= 0 && d[0] < height && d[1] >= 0 && d[1] < width && field[d[0]][d[1]] !== 9) {
			field[d[0]][d[1]] -= 1;
		}
	}
	return field;
}
