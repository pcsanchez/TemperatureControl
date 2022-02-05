import React, { useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Line,
} from "recharts";
import Latex from "react-latex";
import "./App.css";

import Header from "./components/Header";
import RoundedButton from "./components/RoundedButton";
import SelectOption from "./components/SelectOption";

import deadbeat from "./services/deadbeatService";
import dahlin from "./services/dahlinService";
import pid from "./services/pidService";

function App() {
  const [systemInput, setSystemInput] = useState(1);
  const [iterations, setIterations] = useState(100);
  const [controller, setController] = useState("PID");
  const [kp, setKp] = useState(0);
  const [ki, setKi] = useState(0);
  const [kd, setKd] = useState(0);
  const [tau, setTau] = useState(30);

  const [reference, setReference] = useState([]);
  const [error, setError] = useState([]);
  const [modification, setModification] = useState([]);
  const [output, setOutput] = useState([]);

  const fraction = `$Gp(s) = \\frac{e^{-2s}}{202s + 1}$`;
  const pidEq = `$Gc(z) = Kp + Ki\\frac{T}{2}[\\frac{z+1}{z-1}]+Kd\\frac{2}{T}[\\frac{z-1}{z+1}]$`;
  const deadBeatEq = `$Gc(z) = \\frac{1}{Gp(z)}[\\frac{z^{-N-1}}{1-z^{-N-1}}]$`;
  const dahlinEq = `$Gc(z) = \\frac{1}{Gp(z)}[\\frac{(1-q)z^{-N-1}}{1-qz^{-1}-(1-q)z^{-N-1}}]$`;

  const startSimulation = () => {
    let simValues;
    if (controller === "Deadbeat") {
      simValues = deadbeat(systemInput, iterations);
    } else if (controller === "Dahlin") {
      simValues = dahlin(systemInput, iterations, tau, 0.5);
    } else if (controller === "PID") {
      simValues = pid(systemInput, iterations, kp, ki, kd, 0.5);
    }
    const processedReference = simValues.reference.map((value, index) => {
      return { time: index, value: value };
    });
    const processedOutput = simValues.c.map((value, index) => {
      return { time: index, value: value };
    });
    const processedModification = simValues.m.map((value, index) => {
      return { time: index, value: value };
    });
    const processedError = simValues.error.map((value, index) => {
      return { time: index, value: value };
    });
    setReference(processedReference);
    setOutput(processedOutput);
    setModification(processedModification);
    setError(processedError);
  };

  const getControllerOptions = () => {
    switch (controller) {
      case "PID":
        return (
          <div>
            <div className="latex-equation">
              <Latex>{pidEq}</Latex>
            </div>
            <h3>Kp</h3>
            <input
              id="kp-label"
              type="number"
              step="0.001"
              value={kp}
              onChange={(e) => setKp(e.target.value)}
            />
            <h3>Ki</h3>
            <input
              id="ki-label"
              type="text"
              value={ki}
              onChange={(e) => setKi(e.target.value)}
            />
            <h3>Kd</h3>
            <input
              id="kd-label"
              type="text"
              value={kd}
              onChange={(e) => setKd(e.target.value)}
            />
          </div>
        );
      case "Deadbeat":
        return (
          <div>
            <div className="latex-equation">
              <Latex>{deadBeatEq}</Latex>
              <h3>Deadbeat controller requires no parameters.</h3>
            </div>
          </div>
        );
      case "Dahlin":
        return (
          <div>
            <div className="latex-equation">
              <Latex>{dahlinEq}</Latex>
              <h3>Tau</h3>
              <input
                id="tau-label"
                type="text"
                value={tau}
                onChange={(e) => setTau(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="App">
      <Header />
      <div id="main-content">
        <div id="user-interface">
          <h2>Process Equation</h2>
          <div className="latex-equation-main">
            <Latex>{fraction}</Latex>
          </div>
          <h2>Select System Input</h2>
          <input
            type="text"
            value={systemInput}
            onChange={(e) => setSystemInput(Number(e.target.value))}
          />
          <h2>Number of Iterations</h2>
          <input
            type="text"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
          />
          <h2>Select Your Controller</h2>
          <div id="controller-options">
            <SelectOption
              selected={controller === "PID"}
              height={"100%"}
              width={"25%"}
              displayValue={"PID"}
              onClick={() => setController("PID")}
            />
            <SelectOption
              selected={controller === "Deadbeat"}
              height={"100%"}
              width={"25%"}
              displayValue={"Deadbeat"}
              onClick={() => setController("Deadbeat")}
            />
            <SelectOption
              selected={controller === "Dahlin"}
              height={"100%"}
              width={"25%"}
              displayValue={"Dahlin"}
              onClick={() => setController("Dahlin")}
            />
          </div>
          <div id="controller-params">
            <div id="controller-params-container">{getControllerOptions()}</div>
          </div>
        </div>
        <div id="graphical-interface">
          <div className="graph-row">
            <div className="graph-container">
              <h3>System Reference</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={reference}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-container">
              <h3>System Output</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={output}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="graph-row">
            <div className="graph-container">
              <h3>Error</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={error}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-container">
              <h3>Modification Signal</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={modification}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div id="sim-button-container">
            <RoundedButton
              displayValue={"Start Simulation"}
              onClick={startSimulation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
