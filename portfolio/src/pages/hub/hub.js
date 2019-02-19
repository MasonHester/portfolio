import React from "react";
import "./hub.css"

class Hub extends React.Component {
	state = {
		windowDimensions: {},
		mountainInfo: {
			sky: "#eaefff",
			foreground: "#37467a"
		},
		paths: []
	};

	// Generates random Number
	// Expected Input: (0, 0)
	gen_random_number = (low, high) => {
		const min = Math.floor(low);
		const max = Math.ceil(high);
		return Math.floor(Math.random() * (max - min + 1) + min)
	};

	positive_or_negative = () => {
		return Math.random < 0.5 ? -1 : 1
	}

	// Returns array in RGB format -- [R, G, B]
	// Expected Input: "#xxxxxx"
	convert_to_rgb = (hex) => {
		return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
	};

	// Converts a single RGB value, or multiple to their corresponding Hexidecimal Values
	// Expected Input: [0, 0, 0] || [[0, 0, 0], [1, 1, 1], ...] (An array of RGB Values or an array of arrays containing RGB values)
	convert_to_hex = (rgb) => {
		switch (typeof (rgb[0])) {
			case "number":
				let hex = "#";

				rgb.map(color => {
					return hex += Math.round(color).toString(16);
				});

				return hex;

			default:
				const hexSet = [];

				rgb.map(set => {
					return hexSet.push(this.convert_to_hex(set));
				});

				return hexSet;
		}
	};

	// Finds equally distanced numbers inbetween a floor and ceiling
	// Expected Input: (0, 0, 0, "rgb" || if non-specific "null")
	step_values = (first, last, total, type) => {
		const steppedValues = [];

		switch (type) {
			case "rgb":

				for (let j = 0; j <= total; j++) {
					steppedValues.push([]);
				};

				const differences = first.map((color, i) => {
					const tempDifference = 0 - Math.abs(color - last[i]);
					return tempDifference
				});

				for (let step = 0; step <= total; step++) {
					differences.map((diff, i) => {
						const color = first[i] + ((diff / total) * step);
						steppedValues[step].push(color);
						return null;
					});
				};

				break;
			default:
				const diff = 0 - Math.abs(first - last);

				for (let step = 0; step <= total; step++) {
					const value = first + ((diff / total) * step);
					steppedValues.push(value);
				};

				break;
		};

		return steppedValues;
	};

	// Generates the colors for each mountain layer
	// Expected Input: ("#xxxxxx", "#xxxxxx", 0)
	gen_layer_hex_values = (sky, foreground, totalLayers) => {
		const skyRGB = this.convert_to_rgb(sky);
		const foregroundRGB = this.convert_to_rgb(foreground);

		const steppedValuesRGB = this.step_values(skyRGB, foregroundRGB, totalLayers, "rgb");

		const steppedValuesHex = this.convert_to_hex(steppedValuesRGB);

		return steppedValuesHex;
	}

	// Generates the vertice density for each mountain
	// Expected Input: 0
	gen_peak_densities = (totalLayers) => {
		const initialDensity = this.gen_random_number(16, 22);
		const finalDensity = this.gen_random_number(8, 12);
		const rawPeakDensities = this.step_values(initialDensity, finalDensity, totalLayers);
		const reducedPeakDensities = [];
		rawPeakDensities.map(density => reducedPeakDensities.push(Math.round(density)));
		return reducedPeakDensities;
	}

	gen_peak_definitions = (windowDimensions, peakDensities) => {
		const reducedFullDefinitionSet = []
		peakDensities.map(density => {
			const rawDefinitionSet = this.step_values(windowDimensions.width, 0, density);
			const reducedDefinitionSet = []

			rawDefinitionSet.map(definition => {
				reducedDefinitionSet.push([Math.round(definition), (windowDimensions.height - (density * 40))]);
			});

			reducedFullDefinitionSet.push(reducedDefinitionSet)
		});

		return reducedFullDefinitionSet;
	}

	add_noise_to_xy_array_set = rawDefinitions => {
		const subHouse = []

		rawDefinitions.map(array => {
			subHouse.push([array[0], array[1] + (this.positive_or_negative() * this.gen_random_number(0, 80))])
		})

		return subHouse;

	}

	break_down_multi_xy_arrays = arraySets => {
		const house = [];

		arraySets.map(arraySet => {
			house.push(this.add_noise_to_xy_array_set(arraySet));
		})

		return house;
	}

	temp = (pointsSet) => {
		const pathDefinitions = [];

		pointsSet.map((points, i) => {
			let path = "M "

			points.map((point, j) => {
				j === (pointsSet[i].length - 1) ? path += `${point[0]} ${point[1]}` : path += `${point[0]} ${point[1]} L `;
			})

			pathDefinitions.push(path);

			console.log(`-------------\n-------------\n-------------`)
		});

		return pathDefinitions;
	}

	// Main controller for drawing mountains, triggered once on page load
	draw_mountains = () => {
		// 1366 x 768
		const windowDimensions = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		const mountainLayers = this.gen_random_number(4, 6);
		const layerHexValues = this.gen_layer_hex_values(this.state.mountainInfo.sky, this.state.mountainInfo.foreground, mountainLayers);
		const peakDensities = this.gen_peak_densities(mountainLayers - 1);
		const rawPeakDefinitions = this.gen_peak_definitions(windowDimensions, peakDensities);
		const reducedPeakDefinitions = this.break_down_multi_xy_arrays(rawPeakDefinitions);

		const atemp = this.temp(reducedPeakDefinitions);
		console.log("--------------------")
		console.log(windowDimensions, mountainLayers, layerHexValues, peakDensities, rawPeakDefinitions, reducedPeakDefinitions);
		console.log("--------------------")

		this.setState({ windowDimensions: windowDimensions, paths: atemp })

		console.log(this.state)
	}

	componentDidMount = () => {
		console.log(this.refs)
		this.draw_mountains();
		window.addEventListener("resize", this.draw_mountains);
	}

	render() {
		return (
			<div className="wrapper" style={{ backgroundColor: this.state.mountainInfo.sky }}>
				<svg width={this.state.windowDimensions.width} height={this.state.windowDimensions.height} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
					{this.state.paths.map((path, i) => {
						return <path key={i} ref={(ref) => {this.path = ref}} stroke="#111111" strokeWidth="2" fill={this.state.mountainInfo.sky} d={path}></path>
					})}
				</svg>
				<div className="main">Test 1</div>
				<div className="complement">Test 2</div>
				<div className="highlight">Test 3</div>
				<div className="main">W: {this.state.windowDimensions.width} H: {this.state.windowDimensions.height}</div>
			</div>
		)
	}
}

export default Hub;