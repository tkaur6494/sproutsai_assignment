import "./App.css";
import { useState } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import ChartBuilder from "./components/ChartBuilder";
import Dashboard from "./components/Dashboard";

function App() {
  const [showChartBuilder, setShowChartBuilder] = useState(false);

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
        />
      )}
      <Dashboard/>
    </Container>
  );
}

export default App;
