import {
  Row,
  Col,
  ListGroup,
  Card,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import FilterModal from "./chartbuilder/FilterModal";
import Chart from "./chartbuilder/Chart";
import { SketchPicker } from "react-color";
import axios from "axios";

const ChartBuilder = ({
  showChartBuilder,
  setShowChartBuilder,
  addChartToDashboard,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [xAxisList, setXAxisList] = useState([]);
  const [yAxisList, setYAxisList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [columnFilter, setColumnFilter] = useState(" ");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [columnNameList, setColumnNameList] = useState([]);
 

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_PATH}/columns`)
      .then((response) => {
        setColumnNameList(response?.data);
      })
      .catch((error) => {});
  }, []);

  const onDragStart = (ev, columnName) => {
    ev.dataTransfer.setData("columnName", columnName);
  };

  const onDropXAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    if (!xAxisList.filter((item) => item === columnName).length > 0) {
      setXAxisList([...xAxisList, columnName]);
    }
  };

  const onDropYAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    if (!yAxisList.filter((item) => item?.column === columnName).length > 0) {
      setYAxisList([
        ...yAxisList,
        { column: columnName, aggregation: "COUNT", color:"#2CAFFE" },
      ]);
    }
  };

  const onDropFilter = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    setShowFilterModal(true);
    setColumnFilter(columnName);
  };

  const onCancelModel = () => {
    setShowFilterModal(false);
    setColumnNameList([...columnNameList, columnFilter]);
  };

  const onSaveFilter = (condition, value) => {
    setShowFilterModal(false);
    setFilterList([
      ...filterList,
      { column: columnFilter, condition: condition, value: value },
    ]);
  };

  const handleChangeColorPicker = (colorPicked, yAxisItem) => {
    let yAxisListUpdated = yAxisList.map((item) => {
      if (item?.column === yAxisItem) {
        return { ...item, color: colorPicked.hex};
      }
      return item;
    });
    setYAxisList(yAxisListUpdated);
  };

  const handleAddToDashboard = () => {
    addChartToDashboard(
      {
        dimensions: xAxisList,
        measures: yAxisList,
        filters: filterList,
      }
    );
    setShowChartBuilder(false);
  };

  const handleYAxisAggregation = (e, yAxisItem) => {
    let yAxisListUpdated = yAxisList.map((item) => {
      if (item?.column === yAxisItem) {
        return { ...item, aggregation: e.target.value };
      }
      return item;
    });
    setYAxisList(yAxisListUpdated);
  };

  const resetChartBuilder = () => {
    setXAxisList([]);
    setYAxisList([]);
    setFilterList([]);
  };

  return (
    <Modal show={showChartBuilder} fullscreen={true}>
      <Modal.Header
        closeButton={true}
        onHide={() => setShowChartBuilder(false)}
      >
        Create Chart
      </Modal.Header>
      <Modal.Body style={{ height: "100%" }}>
        <Row className="component-row">
          <Col md={2}>
            <Card className="component-card">
              <Card.Header>List of Attributes</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {columnNameList.map((item) => {
                    return (
                      <div
                        className="component-draggable"
                        draggable
                        onDragStart={(ev) => {
                          onDragStart(ev, item);
                        }}
                        key={item}
                      >
                        {item}
                      </div>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="component-card">
              {/* <Card.Body> */}
              <div
                style={{ height: "33%" }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropXAxis(ev)}
              >
                <Card.Header>x Axis</Card.Header>
                <Card.Body>
                  {xAxisList.map((xAxisItem) => {
                    return (
                      <Row className="component-draggable" key={xAxisItem}>
                        <Col md={12}>{xAxisItem}</Col>
                      </Row>
                    );
                  })}
                </Card.Body>
              </div>

              <div
                style={{ height: "33%" }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropYAxis(ev)}
              >
                <Card.Header>yAxis</Card.Header>
                {yAxisList.map((yAxisItem) => {
                  return (
                    <Row
                      className="component-draggable"
                      key={yAxisItem?.column}
                    >
                      <Col md={6}>
                        <span className="component-draggable-text">
                          {yAxisItem?.column}
                        </span>
                      </Col>
                      <Col md={5}>
                        <span className="component-draggable-select">
                          <Form>
                            <Form.Select
                              className="form-select-draggable"
                              onChange={(value) =>
                                handleYAxisAggregation(value, yAxisItem?.column)
                              }
                            >
                              <option value="COUNT">Count</option>
                              <option value="SUM">Sum</option>
                              <option value="AVG">Avg</option>
                            </Form.Select>
                          </Form>
                        </span>
                      </Col>
                      <Col md={1}>
                        <div
                          onClick={() => setShowColorPicker(true)}
                          className="component-color-picker"
                          style={{
                            background: `${yAxisItem?.color}`,
                          }}
                        >
                          <div />
                        </div>
                        {showColorPicker && (
                          <div className="component-color-picker-popover">
                            <div
                              className="component-color-picker-cover"
                              onClick={() => {
                                setShowColorPicker(false);
                              }}
                            />
                            <SketchPicker
                              color={yAxisItem?.color}
                              onChange={(colorPicked) => {
                                handleChangeColorPicker(colorPicked, yAxisItem?.column);
                              }}
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  );
                })}
              </div>
              <div
                style={{ height: "33%" }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropFilter(ev)}
              >
                <Card.Header>Filter</Card.Header>

                {filterList.map((item) => {
                  return (
                    <div
                      title={`Column Name: ${item?.column}\n Condition: ${item?.condition}\n Values: ${item?.value}`}
                      className="component-draggable"
                      key={item?.column}
                    >
                      {item?.column}
                    </div>
                  );
                })}
                <FilterModal
                  columnName={columnFilter}
                  showFilterModal={showFilterModal}
                  onCancelModel={onCancelModel}
                  onSaveFilter={onSaveFilter}
                />
              </div>
            </Card>
          </Col>
          <Col md={7}>
            <Card className="component-card">
              <Card.Header>Visualization</Card.Header>
              <Card.Body>
                {xAxisList.length >= 1 && yAxisList.length >= 1 ? (
                  <>
                    <Row className="component-chart-container">
                      <Chart
                        query_data={{
                          dimensions: xAxisList,
                          measures: yAxisList,
                          filters: filterList,
                        }}
                      />
                    </Row>
                    <Row>
                      <Col md={{ span: 3, offset: 7 }}>
                        <Button
                          onClick={() => {
                            handleAddToDashboard();
                          }}
                        >
                          Add to Dashboard
                        </Button>
                      </Col>
                      <Col md={{ span: 1 }}>
                        <Button
                          onClick={() => {
                            resetChartBuilder();
                          }}
                        >
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <p>
                    Please select atleast one column in the x-axis and one
                    column in the y-axis.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ChartBuilder;
