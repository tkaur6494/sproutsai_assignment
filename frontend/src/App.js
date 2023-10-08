import "./App.css";
import { useState, useEffect } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import ChartBuilder from "./components/ChartBuilder";
import Dashboard from "./components/Dashboard";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";
import axios from "axios";



function App() {
  
  const [cookies] = useCookies(["auth-cookie"]);
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [gridChartConf, setGridChartConf] = useState([]);
  useEffect(() => {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = `Bearer ${cookies["auth-cookie"].token}`;
      return config;
    })
  }, [cookies]);
  const addChartToDashboard = (chartConf) => {
    let positionX = 0;
    let positionY = 0;
    if (gridChartConf.length > 0) {
      positionX = gridChartConf[gridChartConf.length - 1].x + 4;
      if (positionX >= 12) {
        positionX = 0;
        positionY = gridChartConf[gridChartConf.length - 1].y + 60;
      }
    }
    setGridChartConf([
      ...gridChartConf,
      {
        grid: {
          i: uuidv4(),
          x: positionX,
          y: positionY,
          h: 6,
          w: 4,
          isResizable: true,
          isDraggable: true,
        },
        chartOptions: chartConf,
      },
    ]);
  };


  return (
    <Container fluid={true}>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand href="#home">Analytics Dashboard</Navbar.Brand>
        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Button onClick={() => setShowChartBuilder(!showChartBuilder)}>
              Add Chart
            </Button>
          </Navbar.Text>

          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>

      {showChartBuilder && (
        <ChartBuilder
          showChartBuilder
          setShowChartBuilder={setShowChartBuilder}
          addChartToDashboard={(chartOptions) =>
            addChartToDashboard(chartOptions)
          }
        />
      )}
      <Dashboard gridChartConf={gridChartConf} />
    </Container>
  );
}

export default App;
