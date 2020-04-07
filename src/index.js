import {Database} from "./database/database";
import {CountrySource} from "./sources/country-source";
import {CovidCasesSource} from "./sources/covid-cases-source";
import {Simulation} from "./simulation/simulation";
import {CovidData} from "./database/covid-data";
import "chart.js";
import "hammerjs";
import "chartjs-plugin-zoom";
import ReactDOM from "react-dom";
import React from "react";
import {Test} from "./gui/test";

window.onload = function ()
{
	var simulation = null;
	var chart = createChart();
	var database = new Database();


	ReactDOM.render(React.createElement(Test), document.getElementById("container"));

	// Log database to window
	console.log(database);
	createButton();

	CountrySource.loadList(database);

	CovidCasesSource.fetchCSSE(database, function() {});

	CovidCasesSource.fetchDSSGPT(database, function() {
		drawCovidData(chart, database.getCovidCases("PRT"), "PRT", true);
	});
	CovidCasesSource.fetchPCMDPCITA(database, function() {
		drawCovidData(chart, database.getCovidCases("ITA"), "ITA", true);
	});

	function createButton() {
		var button = document.createElement("button");
		button.onclick = runSimulation;
		button.innerText = "Run";
		document.body.appendChild(button);
	}

	function runSimulation() {
		if (simulation === null) {
			simulation = new Simulation();
			simulation.config.date = new Date(2020, 1, 25);
			simulation.reset();
			console.log("Simulation reset ok.");
		}

		var last = performance.now();
		for (var i = 0; i < 10; i++) {
			simulation.step();

			// Log time to console
			var time = performance.now();
			console.log("Simulation step " + i + " finished (" + (time - last) + "ms)");
			last = time;
		}

		drawCovidData(chart, database.getCovidCases("PRT"), "PRT", false);
		drawCovidData(chart, simulation.data, "Simulation", true);
	}

	function createChart() {
		var canvas = document.createElement("canvas");
		canvas.width = 1400;
		canvas.height = 800;
		canvas.style.width = canvas.width + "px";
		canvas.style.height = canvas.height + "px";
		document.body.appendChild(canvas);

		var context = canvas.getContext("2d");

		var chart = new Chart(context, {
			type: "line",
			data: {
				datasets: []
			},
			options: {
				responsive: false,
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
							labelString: "Time"
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

		return chart;
	}

	function drawCovidData(chart, data, title, append) {
		var timeseries = CovidData.generateTimeseries(data);

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

		chart.data.datasets = append ? chart.data.datasets.concat(datasets) : datasets;
		chart.update();
	}
}
