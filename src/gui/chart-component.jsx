import {CovidData} from "../database/covid-data";
import React from "react";
import "chart.js";
import "hammerjs";
import "chartjs-plugin-zoom";

/**
 * Chart to draw graphs into the GUI.
 */
class ChartComponent extends React.Component
{
	constructor(props)
	{
		super(props);
		this.canvas = React.createRef();
		this.chart = null;
	}

	/**
	 * Called when the component is mounted to the interface.
	 */
	componentDidMount()
	{
		this.createChart();
	}

	/**
	 * Create chart.js object and attach to the canvas element.
	 */
	createChart()
	{
		var context = this.canvas.current.getContext("2d");

		this.chart = new Chart(context, {
			type: "line",
			data: {
				datasets: []
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				pan: {
					enabled: true,
					mode: "x",
					speed: 100,
					threshold: 100
				},
				zoom: {
					enabled: true,
					drag: false,
					mode: "x",
					limits: {
						max: 10,
						min: 0.5
					}
				},
				title: {
					display: false,
				},
				tooltips: {
					mode: "index",
					intersect: false,
				},
				hover: {
					mode: "nearest",
					intersect: true
				},
				scales: {
					xAxes: [{
						type: "time",
						time: {
							displayFormats: {
								quarter: "MMM YYYY"
							}
						},
						scaleLabel: {
							display: true,
							labelString: "Date"
						}
					}],
					yAxes:
						[{
							scaleLabel: {
								display: true,
								labelString: "People"
							}
						}]
				}
			}
		});
	}

	/**
	 * Draw data into the chart component by its date.
	 *
	 * @param data
	 * @param title
	 * @param append
	 */
	drawCovidCases(data, title, append)
	{
		var timeseries = {
			infected: [],
			recovered: [],
			deaths: [],
			suspects: []
		};

		for (var i = 0; i < data.length; i++) {
			timeseries.infected.push({t: data[i].date, y: data[i].infected});
			timeseries.recovered.push({t: data[i].date, y: data[i].recovered});
			timeseries.deaths.push({t: data[i].date, y: data[i].deaths});
			timeseries.suspects.push({t: data[i].date, y: data[i].suspects});
		}

		let datasets = [
			{
				label: title + " - Suspects",
				backgroundColor: "rgba(47,180,254, 0.3)",
				borderColor: "rgb(47,180,254)",
				fill: true,
				data: timeseries.suspects
			},
			{
				label: title + " - Infected",
				backgroundColor: "rgba(254, 123, 5, 0.3)",
				borderColor: "rgba(254, 123, 5, 1)",
				fill: true,
				data: timeseries.infected
			},
			{
				label: title + " - Deaths",
				backgroundColor: "rgba(254,0,34, 0.3)",
				borderColor: "rgb(254,0,34)",
				fill: true,
				data: timeseries.deaths
			},
			{
				label: title + " - Recovered",
				backgroundColor: "rgba(50,254,0, 0.3)",
				borderColor: "rgb(50,254,0)",
				fill: true,
				data: timeseries.recovered
			}
		];

		this.chart.data.datasets = append ? this.chart.data.datasets.concat(datasets) : datasets;
		this.chart.update();
	}

	render()
	{
		return (
			<div style={this.props.style}>
				<canvas ref={this.canvas}/>
			</div>
		);
	}
}

export {ChartComponent};
