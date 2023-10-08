import {
  Row,
  Col,
  ListGroup,
  Card,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import FilterModal from "./chartbuilder/FilterModal";
import Chart from "./chartbuilder/Chart";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faXmark, faAdd } from "@fortawesome/free-solid-svg-icons";
import MeasureTag from "./chartbuilder/MeasureTag";

const ChartGenerator = ({
  showChartBuilder,
  setShowChartBuilder,
  addChartToDashboard,
}) => {
  
  const [xAxisList, setXAxisList] = useState([]);
  const [yAxisList, setYAxisList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [columnFilter, setColumnFilter] = useState(" ");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [columnNameList, setColumnNameList] = useState([]);

  useEffect(() => {
    // get list of columns in table
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

  // drag and drop from list of columns to x axis, yaxis and filters
  const onDropXAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    if (
      !xAxisList.filter((item) => item === columnName).length > 0 &&
      xAxisList.length === 0
    ) {
      setXAxisList([...xAxisList, columnName]);
    }
  };

  const onDropYAxis = (ev) => {
    let columnName = ev.dataTransfer.getData("columnName");
    if (!yAxisList.filter((item) => item?.column === columnName).length > 0) {
      setYAxisList([
        ...yAxisList,
        { column: columnName, aggregation: "COUNT", color: "#2CAFFE" },
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
        return { ...item, color: colorPicked.hex };
      }
      return item;
    });
    setYAxisList(yAxisListUpdated);
  };

  const handleShowColorPicker = (showColorPicker, yAxisItem) => {
    let yAxisListUpdated = yAxisList.map((item) => {
      if (item?.column === yAxisItem) {
        return { ...item, "showColorPicker": showColorPicker };
      }
      return item;
    });
    setYAxisList(yAxisListUpdated);
  };

  const handleAddToDashboard = () => {
    addChartToDashboard({
      dimensions: xAxisList,
      measures: yAxisList,
      filters: filterList,
    });
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

  const removeXAxisElement = (xAxisItem) => {
    setXAxisList(xAxisList.filter((item) => item !== xAxisItem));
  };

  const removeYAxisElement = (yAxisItem) => {
    setYAxisList(yAxisList.filter((item) => item?.column !== yAxisItem));
  };

  const removeFilterElement = (filterItem) => {
    setFilterList(filterList.filter((item) => item?.column !== filterItem));
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
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropXAxis(ev)}
              >
                <Card.Header>xAxis</Card.Header>
                <Card.Body className="draggable-container">
                  {xAxisList.map((xAxisItem) => {
                    return (
                      <Row className="component-draggable" key={xAxisItem}>
                        <Col md={11}>{xAxisItem}</Col>
                        <Col md={1}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            color="#0d6efd"
                            onClick={() => removeXAxisElement(xAxisItem)}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </Card.Body>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropYAxis(ev)}
              >
                <Card.Header>yAxis</Card.Header>
                <Card.Body className="draggable-container">
                  <MeasureTag
                    yAxisList={yAxisList}
                    handleYAxisAggregation={handleYAxisAggregation}
                    handleChangeColorPicker={handleChangeColorPicker}
                    handleShowColorPicker={handleShowColorPicker}
                    removeYAxisElement={removeYAxisElement}
                  />
                </Card.Body>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(ev) => onDropFilter(ev)}
              >
                <Card.Header>Filter</Card.Header>
                <Card.Body className="draggable-container">
                  {filterList.map((item) => {
                    return (
                      <Row className="component-draggable" key={item?.column}>
                        <Col md={10}>{item?.column}</Col>
                        <OverlayTrigger
                          overlay={
                            <Tooltip>
                              <div className="component-filter-tooltip">
                                <p>
                                  <b>Column: </b>
                                  {item?.column}
                                </p>
                                <p>
                                  <b>Condition: </b>
                                  {item?.condition}
                                </p>
                                <p>
                                  <b>Values: </b>
                                  {item?.value}
                                </p>
                              </div>
                            </Tooltip>
                          }
                        >
                          <Col md={1}>
                            <FontAwesomeIcon icon={faInfo} color="#0d6efd" />
                          </Col>
                        </OverlayTrigger>
                        <Col md={1}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            color="#0d6efd"
                            onClick={() => removeFilterElement(item?.column)}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </Card.Body>
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
              <Card.Header>
                <Row className="mx-0">
                  <Col md={9} className="d-flex align-items-center">
                    Visualization
                  </Col>
                  {xAxisList.length >= 1 && yAxisList.length >= 1 && (
                    <Col md={{ span: 3 }} className="text-end">
                      <ButtonGroup>
                        <Button
                          onClick={() => {
                            handleAddToDashboard();
                          }}
                        >
                          <FontAwesomeIcon icon={faAdd} color="white" /> Add
                        </Button>
                        <Button
                          onClick={() => {
                            resetChartBuilder();
                          }}
                        >
                          Reset
                        </Button>
                      </ButtonGroup>
                    </Col>
                  )}
                </Row>
              </Card.Header>
              <Card.Body
                className="no-data"
                nodata="Please select atleast one xAxis and one yAxis to continue."
              >
                {xAxisList.length >= 1 && yAxisList.length >= 1 && (
                  <>
                    
                      <Chart
                        query_data={{
                          dimensions: xAxisList,
                          measures: yAxisList,
                          filters: filterList,
                        }}
                      />
                    
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ChartGenerator;
