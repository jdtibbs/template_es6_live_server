	import Cycle from '@cycle/core';
	import {
		button, p, label, div, makeDOMDriver
	}
	from '@cycle/dom';
	import Rx from 'rx';

	// source: is input (read) effects.
	// sink: is output (write) effects.

	// main: is logic
	// returns: sinks
	function main(sources) {
		// build the source streams:
		const decrementClick$ = sources.DOM.select('#dec').events('click');
		const incrementClick$ = sources.DOM.select('#inc').events('click');

		const decrementAction$ = decrementClick$.map(ev => -1);
		const incrementAction$ = incrementClick$.map(ev => +1);

		const number$ = Rx.Observable
			.of(0)
			.merge(decrementAction$)
			.merge(incrementAction$)
			.scan((prev, curr) => prev + curr);

		// return sinks:
		return {
			DOM: number$.map(number =>
				div([
					p([
						label(String(number))
					]),
					button('#dec', 'Decrement'),
					button('#inc', 'Increment'),
				]))
		};
	}


	const drivers = {
		DOM: makeDOMDriver('#app')
	};

	Cycle.run(main, drivers);

	export default {};
