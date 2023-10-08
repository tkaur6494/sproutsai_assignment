import { SketchPicker } from "react-color";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const MeasureTag = ({
  yAxisList,
  handleYAxisAggregation,
  handleChangeColorPicker,
  showColorPicker,
  setShowColorPicker,
  removeYAxisElement
}) => {
  return yAxisList.map((yAxisItem) => {
    return (
      <Row className="component-draggable" key={yAxisItem?.column}>
        <Col md={4}>
          <span className="component-draggable-text">{yAxisItem?.column}</span>
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
        <Col md={1}>
          <FontAwesomeIcon icon={faXmark} color="#0d6efd" onClick={()=>removeYAxisElement(yAxisItem?.column)}/>
        </Col>
      </Row>
    );
  });
};

export default MeasureTag;
