import "./App.css";
import { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Button,
  Row,
  Col,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import ChartBuilder from "./components/ChartBuilder";
import Dashboard from "./components/Dashboard";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";
import axios from "axios";

function App() {
  const [cookies] = useCookies(["auth-cookie"]);
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [gridChartConf, setGridChartConf] = useState([]);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  useEffect(() => {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = `Bearer ${cookies["auth-cookie"].token}`;
      return config;
    });
  }, [cookies]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_PATH}/retrieve`)
      .then((response) => {
        setGridChartConf(response?.data?.[0]?.configuration);
      })
      .catch((error) => {});
  }, []);

  const addChartToDashboard = (query_data) => {
    let positionX = 0;
    let positionY = 0;
    if (gridChartConf.length > 0) {
      positionX = gridChartConf[gridChartConf.length - 1].grid.x + 4;
      if (positionX >= 12) {
        positionX = 0;
        positionY = gridChartConf[gridChartConf.length - 1].grid.y + 3;
      }
    }
    setGridChartConf([
      ...gridChartConf,
      {
        grid: {
          i: uuidv4(),
          h: 2,
          w: 4,
          x: positionX,
          y: positionY,
        },
        query_data,
      },
    ]);
  };

  const onChartResize = (resizedObject) => {
    setGridChartConf(
      gridChartConf.map((item, index) => {
        let resizedEle = resizedObject.filter(
          (el) => el.i === item?.grid?.i
        )?.[0];
        if ((item.grid.i = resizedObject)) {
          return { ...item, grid: resizedEle };
        } else {
          return item;
        }
      })
    );
  };

  const saveToDashboard = () => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_PATH}/save`, gridChartConf)
      .then((response) => {
        setDisplaySuccess(true);
        console.log(response);
        // console.log(response.data);
      });
  };

  return (
    <Container fluid={true}>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand href="#home">Analytics Dashboard</Navbar.Brand>
        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          {gridChartConf.length > 0 && (
            <Col md={{ span: 2, offset: 4 }}>
              <Navbar.Text>
                <Button onClick={() => saveToDashboard()}>
                  Save Dashboard
                </Button>
              </Navbar.Text>
            </Col>
          )}
          <Col md={{ span: 1 }}>
            <Navbar.Text>
              <Button onClick={() => setShowChartBuilder(!showChartBuilder)}>
                Add Chart
              </Button>
            </Navbar.Text>
          </Col>
          <Col md={{ span: 2 }}>
            <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text>
          </Col>
        </Navbar.Collapse>
      </Navbar>

      {showChartBuilder && (
        <ChartBuilder
          showChartBuilder
          setShowChartBuilder={setShowChartBuilder}
          addChartToDashboard={addChartToDashboard}
        />
      )}

      <Row className="component-row">
        {gridChartConf.length === 0 ? (
          <Card className="component-card">
            Please add charts to view the dashboard
          </Card>
        ) : (
          <Dashboard
            gridChartConf={gridChartConf}
            onChartResize={onChartResize}
          />
        )}
      </Row>
      <ToastContainer position="top-end">
        <Toast
          bg="success"
          autohide={true}
          delay={3000}
          onClose={()=>{setDisplaySuccess(false)}}
          show={displaySuccess}
        >
          <Toast.Body className="text-white">
            Dashboard saved successfully.
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <footer class="footer">
      <div class="container">
        <span class="text-muted">Place sticky footer content here.</span>
      </div>
    </footer>
    </Container>
  );
}

export default App;
