import "chart.js";
import "hammerjs";
import "chartjs-plugin-zoom";
import ReactDOM from "react-dom";
import React from "react";
import {Screen} from "./gui/screen.jsx";
import {Global} from "./global";

Global.loadData();

var div = document.createElement("div");
div.style.position = "absolute";
div.style.top = "0px";
div.style.left = "0px";
div.style.width = "100%";
div.style.height = "100%";
document.body.append(div);

ReactDOM.render(React.createElement(Screen), div);
