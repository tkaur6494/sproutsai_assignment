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
  const list_dimensions = [
    "Gender",
    "Race/Ethnicity",
    "Parental Level of Education",
    "Lunch",
    "Test Preparation Score",
    "Math Score",
    "Reading Score",
    "Writing Score",
  ];

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [xAxisList, setXAxisList] = useState([]);
  const [yAxisList, setYAxisList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [columnFilter, setColumnFilter] = useState(" ");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [columnNameList, setColumnNameList] = useState(list_dimensions);
  const [chartColor, setChartColor] = useState("#2CAFFE");
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
  }, []);

  const onDragStart = (ev, columnName) => {
    ev.dataTransfer.setData("columnName", columnName);
  };

  const onDropXAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    setXAxisList([...xAxisList, columnName]);
    setColumnNameList(columnNameList.filter((item) => item !== columnName));
  };

  const onDropYAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    setYAxisList([...yAxisList, columnName]);
    setColumnNameList(columnNameList.filter((item) => item !== columnName));
    setChartOptions({
      chart: {
        type: "bar",
      },
      title: {
        text: "",
      },
      credits: { enabled: false },
      series: [
        {
          type: "bar",
          data: [1, 2, 3],
        },
      ],
      xAxis: {
        categories: ["Foo", "Bar", "Baz"],
        labels: {
          useHTML: true,
        },
      },
    });
  };

  const onDropFilter = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    setShowFilterModal(true);
    setColumnFilter(columnName);
    setColumnNameList(columnNameList.filter((item) => item !== columnName));
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

  const handleChangeColorPicker = (colorPicked) => {
    setChartColor(colorPicked.hex);
    setChartOptions({
      ...chartOptions,
      series: [
        {
          ...chartOptions.series[0],
          color: `${colorPicked.hex}`,
        },
      ],
    });
  };

  const handleAddToDashboard = (chartOptions) => {
    addChartToDashboard(chartOptions);
    setShowChartBuilder(false);
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
                    // <div className="component-draggable" key={yAxisItem}>
                    <Row className="component-draggable">
                      <Col md={6}>
                        <span className="component-draggable-text">
                          {yAxisItem}
                        </span>
                      </Col>
                      <Col md={5}>
                        <span className="component-draggable-select">
                          <Form.Select className="form-select-draggable">
                            {/* <option>Open this select menu</option> */}
                            <option value="count">Count</option>
                            <option value="sum">Sum</option>
                            <option value="avg">Avg</option>
                          </Form.Select>
                        </span>
                      </Col>
                      <Col md={1}>
                        <div
                          onClick={() => setShowColorPicker(true)}
                          className="component-color-picker"
                          style={{
                            background: `${chartColor}`,
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
                              color={chartColor}
                              onChange={(colorPicked) => {
                                handleChangeColorPicker(colorPicked);
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
                      <Chart chartOptions={chartOptions} />
                    </Row>
                    <Row>
                      <Col md={{ span: 3, offset: 9 }}>
                        <Button
                          onClick={() => {
                            handleAddToDashboard(chartOptions);
                          }}
                        >
                          Add to Dashboard
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
