import "./App.css";
import { useState } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import ChartBuilder from "./components/ChartBuilder";
import Dashboard from "./components/Dashboard";
import { v4 as uuidv4 } from "uuid";


function App() {
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [gridChartConf, setGridChartConf] = useState([]);
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
          y: 0,
          h: 6,
          w: 4,
          isResizable: true,
          isDraggable: true,
        },
        chartOptions: chartConf,
      },
    ]);
  };

  const onChartResize = (resizedObject) => {
    let test = gridChartConf.map((item, index)=>{
      item.grid = resizedObject[index]
      return item  
    })
    
    setGridChartConf(test)
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
      <Dashboard gridChartConf={gridChartConf} onChartResize={onChartResize} />
    </Container>
  );
}

export default App;
