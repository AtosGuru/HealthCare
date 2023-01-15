import React, { Component } from 'react';
import './../css/App.css';
import axios from 'axios'
import {DropdownButton,Dropdown,Button,Form,Row,Col,FloatingLabel} from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const rotaColumns = [
  {
    name: "Date",
    center:true,
    wrap:true,
    selector: (row) => row.date,
  },
  {
    name: "Nurse",
    center:true,
    wrap:true,
    selector: (row) => row.nurse,
  },
  {
    name: "Patient",
    center:true,
    wrap:true,
    selector: (row) => row.patient,
  },
  {
    name: "Action",
    center:true,
    wrap:true,
    sortable: false,
    selector: "null",
    cell: (d) => [
      <DropdownButton id="dropdown-basic-button" title="Action" style={{width:'100px'}}>
        <Dropdown.Item href={"edit/"+d.full_name}>edit</Dropdown.Item>
        <Dropdown.Item href={"delete/"+d.full_name}>delete</Dropdown.Item>
      </DropdownButton>
    ]
  }
];

export default class Report extends Component {
  constructor(props) {
      super(props);
      this.state = {rotas: []};
  }

  componentDidMount() {
      axios.get('nurse/list')
          .then(response => {
            console.log(response.data);
              this.setState({ rotas: response.data });
          })
          .catch(function (error){
              console.log(error);
          })
  }

  render() {
    const {rotas} = this.state;

    return (
      <div className="wrapper">
        <h1>Daily Time Record</h1>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Nurse</Form.Label>
              <Form.Select aria-label="nurse select">
                <option>Select Nurse</option>
                <option value="1">Nurse1</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select aria-label="patient select">
                <option>Select Patient</option>
                <option value="1">Patient1</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Report Content</Form.Label>
              <Form.Control  as="textarea" rows={3}/>
            </Form.Group>
          </Col>
          <Col>
            <Button variant="success" className='mb-3 float-right'>Assign</Button>
          </Col>
        </Row>
        <div className='p-2'>
          <DataTable 
            columns={rotaColumns} 
            data={rotas}
            fixedHeader
            fixedHeaderScrollHeight={300}
            pagination />
        </div>
      </div>
    );
  };
}