import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel
} from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

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
			...options
		});
	}
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	// generateModel() {
	// 	return new AdvancedLinkModel();
	// }

	// generateLinkSegment(model, selected, path) {
	// 	return (
	// 		<g>
	// 			<AdvancedLinkSegment model={model} path={path} />
	// 		</g>
	// 	);
	// }
}