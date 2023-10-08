import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";

const FilterModal = ({ columnName, showFilterModal, onCancelModel, onSaveFilter }) => {
  const [condition, setCondition] = useState("=")
  const [textValue, setTextValue] = useState("")
  
  return (
      <Modal show={showFilterModal} centered className="component-filter-modal">
        <Modal.Header
          closeButton={true}
          onHide={() => onCancelModel()}
        >
          Add condition
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Control type="text" readOnly={true} value={columnName}  />
            </Col>
            <Col>
              <Form.Select onChange={(e)=>{setCondition(e.target.value)}} defaultValue={"="}>
                <option key="=" value="=">equals</option>
                <option key="!=" value="!=">does not equal</option>
                <option key=">" value=">">greater than</option>
                <option key=">=" value=">=">greater than or equal to</option>
                <option key="<" value="<">less than</option>
                <option key="<=" value="<=">less than or equal to</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Control type="text" placeholder="value" onChange={(e)=>{setTextValue(e.target.value)}} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Col md={{ span: 2, order: "last" }}>
            <Button onClick={(e)=>{onSaveFilter(condition, textValue)}}>Save</Button>
          </Col>
          <Col md={{ span: 2, order: "last" }}>
            <Button onClick={() => onCancelModel()}>Cancel</Button>
          </Col>
        </Modal.Footer>
      </Modal>
  );
};

export default FilterModal;
