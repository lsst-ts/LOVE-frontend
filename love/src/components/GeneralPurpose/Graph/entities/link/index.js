import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel
} from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { AdvancedLinkWidget } from './AdvancedLinkWidget';

// export class AdvancedLinkSegment extends React.Component {
// 	// path: SVGPathElement;
// 	// circle: SVGCircleElement;
// 	// callback: () => any;
// 	// percent: number;
// 	// handle: any;
// 	// mounted: boolean;

// 	constructor(props) {
// 		super(props);
// 		this.percent = 0;
// 	}

// 	componentDidMount() {
// 		this.mounted = true;
// 		this.callback = () => {
// 			if (!this.circle1 || !this.circle2 || !this.path) {
// 				return;
// 			}

// 			const point = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);

// 			this.circle1.setAttribute('cx', '' + point.x);
// 			this.circle1.setAttribute('cy', '' + point.y);

// 			this.circle2.setAttribute('cx', '' + point.x);
// 			this.circle2.setAttribute('cy', '' + point.y);


// 		};
// 		this.callback();
// 	}

// 	componentWillUnmount() {
// 		this.mounted = false;
// 	}

// 	render() {
// 		return (
// 			<>
// 				<path
// 					fill="none"
// 					ref={(ref) => {
// 						this.path = ref;
// 					}}
// 					strokeWidth={this.props.model.getOptions().width}
// 					stroke="white"
// 					d={this.props.path}
// 				/>
// 				<circle
// 					ref={(ref) => {
// 						this.circle1 = ref;
// 					}}
// 					r={5.6}
// 					stroke='#798F9B'
// 					fill='#798F9B'
// 				/>
// 				<circle
// 					ref={(ref) => {
// 						this.circle2 = ref;
// 					}}
// 					r={3.2}
// 					stroke='#FFFFFF'
// 					fill='#FFFFFF'
// 				/>
// 			</>
// 		);
// 	}
// }



export class AdvancedLinkModel extends DefaultLinkModel {
	constructor(options) {
		super({
			type: 'advanced',
			selected: false,
			...options
		});
	}

	// setSelected(selected) {
	// 	console.log('selectd', selected);
	// 	console.log('this.options', this.options)
	// 	if (this.options.selected !== selected) {
	// 		this.options.selected = selected;

	// 		this.fireEvent(
	// 			{
	// 				isSelected: selected
	// 			},
	// 			'selectionChanged'
	// 		);
	// 	}
	// }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateReactWidget(event) {
		return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event) {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model, selected, path) {
		return (
			<path
				stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
				strokeWidth={model.getOptions().width}
				d={path}
				pointerEvents='all'
			/>
		);
	}
}