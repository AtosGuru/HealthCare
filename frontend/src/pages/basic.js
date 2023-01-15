import React, { Component } from 'react';
import './../css/App.css';
import axios from '../config/server.config'
import {
  Tab,Tabs,Modal,Form,FloatingLabel
} from 'react-bootstrap';
import { CSVLink } from "react-csv";
import {IoMdDownload} from 'react-icons/io'
import {MDBContainer,MDBRow,MDBCol,MDBBtn,MDBBtnGroup} from 'mdb-react-ui-kit'
import DataTable from 'react-data-table-component';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { FaEdit,FaTrash } from "react-icons/fa";

import {
  nIns,nUpd,nDel,pIns,pUpd,pDel,lIns,lUpd,lDel,hSet
} from './../store/Actions/BasicAction';
import {connect} from 'react-redux'

class Basic extends Component {
  constructor(props) {
      super(props);
      this.state = {
        nurse:{
          open:false,
          action_id:'0',
          modal:{
            name:'',
            designation:'',
            address:'',
            image:'',
            cell:'',
            code:'',
            country:'',
            experience:'',
            date:'',
            workexp:'',
            level:'',
            basic_allowances:0,
            housing_allowances:0,
            other_allowances:0,
          }
        },patient:{
          open:false,
          action_id:'0',
          modal:{
            name:'',
            specialty:'',
            address:'',
            image:'',
            cell:'',
            leve:'',
          }
        },level:{
          open:false,
          action_id:'0',
          modal:{
            level:'',
            rate:'',
          }
        },
        holiday:{
          month:1,
          day:1,
        }
      };
  }
  //Nurse Manage
  nurseModal = (open,data)  =>{
    if(data !== null && data != undefined){
      this.setState({
        nurse:{
          ...this.state.nurse,
          open:open,
          action_id:data._id,
          modal:{
            ...this.state.nurse.modal,
            ...data
          }
        }
      }); 
    }else{
      this.setState({
        nurse:{
          ...this.state.nurse,
          open:open,
          action_id:'0',
          modal:{
          }
        }
      });
    }
  }
  removeNurse = (data) =>{
    const _self = this;
    axios.post('nurse/remove',{
      _id:data._id
    })
    .then(function (response) {
      const _id = response.data._id;
      _self.props.nurseRemove(_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  nurseConfirm = () =>{
    const _self = this;
    const {nurse} = this.state;
    const values =  Object.values(nurse.modal).filter(e =>  e).length;
    if(values < 13){
      toastr.options = {
        positionClass : 'toast-top-full-width',
        hideDuration: 300,
        timeOut: 3000
      }
      toastr.clear()
      setTimeout(() => toastr.info('please input correct!'), 300)
    }else{
      this.setState({
        ...this.state,
        nurse:{
          ...this.state.nurse,
          open:false,
          modal:{}
        }
      });
      
      axios.post('nurse/add',{
        ...this.state.nurse.modal,id:this.state.nurse.action_id
      })
      .then(function (response) {
        const res = response.data;
        const data = res.data;
        if(res.state === 'insert'){
          _self.props.nurseInsert(data);
        }else{
          _self.props.nurseUpdate(data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  onNurseImageChange = (e,_self) =>{
    var file = e.target.files[0];
    var reader = new FileReader();
    var image;
    reader.onloadend = function() {
      image = reader.result;
      _self.setState({
        nurse:{

          ..._self.state.nurse,
          modal:{
            ..._self.state.nurse.modal,
            image:image,
          }
        }
      })
    }
    reader.readAsDataURL(file);
  }
  nurseModalChange = (target,e) =>{
    this.setState({
      nurse:{
        ...this.state.nurse,
        modal:{
          ...this.state.nurse.modal,
          [target]:e.target.value
        }
      }
    });
  }
  //Patient Manage
  patientModal = (open,data)  =>{
    if(data !== null && data != undefined){
      this.setState({
        patient:{
          ...this.state.patient,
          open:open,
          action_id:data._id,
          modal:{
            ...this.state.patient.modal,
            ...data
          }
        }
      }); 
    }else{
      this.setState({
        patient:{
          ...this.state.patient,
          open:open,
          action_id:'0',
          modal:{
          }
        }
      });
    }
  }
  removePatient = (data) =>{
    const _self = this;
    axios.post('patient/remove',{
      _id:data._id
    })
    .then(function (response) {
      const _id = response.data._id;
      _self.props.patientRemove(_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  patientConfirm = () =>{
    const _self = this;
    const {patient} = this.state;
    const values =  Object.values(patient.modal).filter(e =>  e).length;
    if(values < 5){
      toastr.options = {
        positionClass : 'toast-top-full-width',
        hideDuration: 300,
        timeOut: 3000
      }
      toastr.clear()
      setTimeout(() => toastr.info('please input correct!'), 300)
    }else{
      this.setState({
        ...this.state,
        patient:{
          ...this.state.patient,
          open:false,
          modal:{}
        }
      });
      
      axios.post('patient/add',{
        ...this.state.patient.modal,id:this.state.patient.action_id
      })
      .then(function (response) {
        const res = response.data;
        const data = res.data;
        if(res.state === 'insert'){
          _self.props.patientInsert(data);
        }else{
          _self.props.patientUpdate(data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  onPatientImageChange = (e,_self) =>{
    var file = e.target.files[0];
    var reader = new FileReader();
    var image;
    reader.onloadend = function() {
      image = reader.result;
      _self.setState({
        patient:{
          ..._self.state.patient,
          modal:{
            ..._self.state.patient.modal,
            image:image,
          }
        }
      })
    }
    reader.readAsDataURL(file);
  }
  patientModalChange = (target,e) =>{
    this.setState({
      patient:{
        ...this.state.patient,
        modal:{
          ...this.state.patient.modal,
          [target]:e.target.value
        }
      }
    });
  }
  //Level Manage
  // levelModal = (open,data)  =>{
  //   if(data !== null && data != undefined){
  //     this.setState({
  //       level:{
  //         ...this.state.level,
  //         open:open,
  //         action_id:data._id,
  //         modal:{
  //           ...this.state.level.modal,
  //           ...data
  //         }
  //       }
  //     }); 
  //   }else{
  //     this.setState({
  //       level:{
  //         ...this.state.level,
  //         open:open,
  //         action_id:'0',
  //         modal:{
  //         }
  //       }
  //     });
  //   }
  // }
  // removeLevel = (data) =>{
  //   const _self = this;
  //   axios.post('level/remove',{
  //     _id:data._id
  //   })
  //   .then(function (response) {
  //     const _id = response.data._id;
  //     _self.props.levelRemove(_id);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }
  // levelConfirm = () =>{
  //   const _self = this;
  //   const {level} = this.state;
  //   const values =  Object.values(level.modal).filter(e =>  e).length;
  //   if(values < 2){
  //     toastr.options = {
  //       positionClass : 'toast-top-full-width',
  //       hideDuration: 300,
  //       timeOut: 3000
  //     }
  //     toastr.clear()
  //     setTimeout(() => toastr.info('please input correct!'), 300)
  //   }else{
  //     this.setState({
  //       ...this.state,
  //       level:{
  //         ...this.state.level,
  //         open:false,
  //         level:{}
  //       }
  //     });
      
  //     axios.post('level/add',{
  //       ...this.state.level.modal,id:this.state.level.action_id
  //     })
  //     .then(function (response) {
  //       const res = response.data;
  //       const data = res.data;
  //       if(res.state === 'insert'){
  //         _self.props.levelInsert(data);
  //       }else{
  //         _self.props.levelUpdate(data);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  //   }
  // }
  // levelModalChange = (target,e) =>{
  //   this.setState({
  //     level:{
  //       ...this.state.level,
  //       modal:{
  //         ...this.state.level.modal,
  //         [target]:e.target.value
  //       }
  //     }
  //   });
  // }
  //Holiday Manage
  onChangeHoliday = (i,row) =>{
    const {basic} = this.props;
    var _self = this;

    const day = i > 9?'-'+i:'-0'+i;
    const date = basic.monthNames[row.month]+day;

    axios.post('basic/holiday/get',{
      state:row[i].checked,date:date,
    })
    .then(function (response) {
      if(row[i].checked == false){
        toastr.info("Holiday Added");
      }else{
        toastr.info("Holiday Removed");
      }
      _self.props.holidaySet(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getDesignationArray(row) {
    if(row.level == 0) {
      return 'Registered';
    } else {
      return 'Assistant';
    }
  }


  componentDidMount() {
  }

  render() {
      const {basic} = this.props;
      const {nurse,patient,level} = this.state;
      
      // Mapping nurses array
      basic.nurses.map((data) =>{
        data.designation = this.getDesignationArray(data);
      });
  
      const nurseColumns = [
        {
          name: "Full Name",
          center:true,
          wrap:true,
          width:'150px',
          selector: (row) => row.name,
        },
        {
          name: "Designation",
          center:true,
          wrap:true,
          selector: (row) => row.designation,
        },
       
        {
          name: "Address",
          center:true,
          wrap:true,
          width:'150px',
          selector: (row) => row.address,
        },
        {
          name: "Image",
          center:true,
          wrap:true,
          width:'70px',
          cell: (d) => <img src={d.image} style={{width:'30px',height:'40px'}} />
        },
        {
          name: "Cell",
          center:true,
          selector: (row) => row.cell,
          sortable: true
        },
        {
          name: "Country",
          center:true,
          wrap:true,
          selector: (row) => row.country,
        },
        {
          name: "Experience",
          center:true,
          wrap:true,
          selector: (row) => row.experience,
        },
        {
          name: "JoinDate",
          center:true,
          wrap:true,
          selector: (row) => row.date.slice(0,10),
          sortable: true
        },
        {
          name: "WorkExp",
          center:true,
          wrap:true,
          selector: (row) => row.workexp
        },
        {
          name: "Action",
          center:true,
          wrap:true,
          sortable: false,
          cell: (d) => [
            <MDBBtnGroup key={d._id}>
              <MDBBtn outline color="success" className='my-1 ms-1' size="sm" onClick={() =>this.nurseModal(true,d)}><FaEdit /></MDBBtn>
              <MDBBtn outline color="success" className='my-1 me-1' size="sm" onClick={() =>this.removeNurse(d)}><FaTrash /></MDBBtn>
            </MDBBtnGroup>
          ]
        }
      ];

      let headers = [
        { label: "Full Name", key: "name" },
        { label: "Designation", key: "designation"},
        { label: "Address", key: "address" },
        { label: "Cell", key: "cell" },
        { label: "Country", key: "country" },
        { label: "Experience", key: "experience" },
        { label: "JoinDate", key: "date" },
        { label: "WorkExp", key: "workexp" },
        { label: "Basic Allowances", key: "basic_allowances"},
        { label: "Housing Allowances", key: "housing_allowances"},
        { label: "Other Allowances", key: "other_allowances"}
      ];

   
      const patientColumns = [
        {
          name: "Full Name",
          center:true,
          wrap:true,
          width:'30%',
          selector: (row) => row.name,
        },
        {
          name: "Address",
          center:true,
          wrap:true,
          width:'30%',
          selector: (row) => row.address,
        },
        {
          name: "Image",
          center:true,
          wrap:true,
          width:'70px',
          cell: (d) => <img src={d.image} style={{width:'30px',height:'40px'}} />
        },
        {
          name: "Cell",
          center:true,
          width:'100px',
          selector: (row) => row.cell,
          sortable: true
        },
        {
          name: "Action",
          center:true,
          wrap:true,
          sortable: false,
          cell: (d) => [
            <MDBBtnGroup  key={d._id}>
              <MDBBtn outline color="success" className='my-1 ms-1' size="sm" onClick={() =>this.patientModal(true,d)}><FaEdit /></MDBBtn>
              <MDBBtn outline  color="success" className='my-1 me-1' size="sm" onClick={() =>this.removePatient(d)}><FaTrash /></MDBBtn>
            </MDBBtnGroup>
          ]
        }
      ];

      let header = [
        { label: "Full Name", key: "name" },
        { label: "Address", key: "address" },
        { label: "Cell", key: "cell" }
      ];

      // const levelColumns = [
      //   {
      //     name: "Level",
      //     center:true,
      //     wrap:true,
      //     selector: (row) => row.level,
      //   },
      //   {
      //     name: "Rate",
      //     center:true,
      //     wrap:true,
      //     selector: (row) => row.rate,
      //   },
      //   {
      //     name: "Action",
      //     center:true,
      //     cell: (d) => [
      //       <MDBBtnGroup key={d._id}>
      //         <MDBBtn outline color="success" className='my-1 ms-1' size="sm" onClick={() =>this.levelModal(true,d)}><FaEdit /></MDBBtn>
      //         <MDBBtn outline  color="success" className='my-1 me-1' size="sm" onClick={() =>this.removeLevel(d)}><FaTrash /></MDBBtn>
      //       </MDBBtnGroup>
      //     ]
      //   }
      // ];
      
    

      const holidayColumns = [];
      let holidayDatas = [];
      let holidays = basic.holidays;

      holidayColumns.push({
        name: "Month",
        center:true,
        wrap:true,
        width:'70px',
        padding:'3px',
        selector: (row) => row.month,
      });
      for(let i = 1 ; i <= 31;i++){
        holidayColumns.push({
          name: i,
          center:true,
          width:'2.4vw',
          wrap:true,
          cell: (row) => 
          <Form.Check
            disabled = {row[i]['disabled']}
            checked = {row[i]['checked']}
            type='checkbox'
            isValid={true}
            onChange={() => this.onChangeHoliday(i,row)}
          />
        });
      }
      
      let monthNames = basic.monthNames;
      let date = new Date();
      let year = date.getFullYear();
      for(let i in monthNames){
        let row = [];
        let month = monthNames[i];
        let daysInMonth = new Date(year,month,0).getDate();

        row["month"] = i;
        for(let j=1;j<=31;j++){
          row[j] = [];
          row[j]['checked'] = false;
          row[j]['disabled'] = false;

          let day = j>9?j:'0'+j;

          if(holidays.includes(month+'-'+day)){
            row[j]['checked'] = true;
          }
          if(j > daysInMonth){
            row[j]['disabled'] = true;
          }
        }
        holidayDatas.push(row);
      }
      
      return (
          <MDBContainer>
              <div className="pt-5 text-center text-dark">
                <h1 className="mt-3">Registration</h1>
              </div>
              <MDBRow>
                <MDBCol>
                    <Tabs id="basic_tab">
                        <Tab eventKey="nurse" key={1} title="nurse" className='p-2'>
                          <MDBBtn outline rounded  color='success' onClick={() => this.nurseModal(true,null)}>Add Nurse</MDBBtn>
                         
                         <CSVLink 
                              headers={headers}
                              data={basic.nurses}
                              filename={"nurses.csv"}
                              className="btn btn-success "
                              target="_blank"
                         >
                            <IoMdDownload />Export 
                         </CSVLink>
      
                          <div className='p-2'>
                            <DataTable
                              id="nurseTable"
                              columns={nurseColumns} 
                              data={basic.nurses}
                              fixedHeader
                              fixedHeaderScrollHeight={'65vh'}          
                              defaultPageSize={100}
                              pagination
                            />
                          </div>
                        </Tab>
                        <Tab eventKey="patient" key={2} title="patient" className='p-2'>
                          <MDBRow>
                            <MDBCol>
                              <MDBBtn  outline rounded  color='success' onClick={() => this.patientModal(true)}>Add Patient</MDBBtn>
                              <CSVLink
                              headers={header}
                              data={basic.patients}
                              filename={"patients.csv"}
                              className="btn btn-success "
                              target="_blank"
                         >
                            <IoMdDownload />Export 
                         </CSVLink>
                            </MDBCol>
                            <div className='p-2'>
                            <DataTable
                              columns={patientColumns} 
                              data={basic.patients}
                              fixedHeader
                              fixedHeaderScrollHeight={'65vh'}          
                              defaultPageSize={100}
                              pagination
                            />
                          </div>
                          </MDBRow>
                        </Tab>
                        {/* <Tab eventKey="level" key={3} title="level" className='p-2'>
                          <MDBBtn outline rounded  color='success' onClick={() => this.levelModal(true)}>Add Level</MDBBtn>
                          <div className='p-2'>
                            <DataTable 
                              columns={levelColumns} 
                              data={basic.levels}
                              fixedHeader
                              fixedHeaderScrollHeight={'65vh'}
                              pagination />
                          </div>
                        </Tab> */}
                        <Tab eventKey="holiday" key={3} title="holiday" className='p-2'>
                          <MDBRow>
                            <DataTable
                              id="holidayTable"
                              fixedHeader 
                              fixedHeaderScrollHeight={'70vh'}
                              columns={holidayColumns}
                              data={holidayDatas}
                            />
                          </MDBRow>
                        </Tab>
                    </Tabs>
                </MDBCol>
              </MDBRow>
              <Modal show={nurse.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.nurseModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Nurse {nurse.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MDBRow className="mb-2">
                    <MDBCol>
                      <img alt="No Image" src={nurse.modal.image} style={{width:'90px',height:'120px'}}></img>
                    </MDBCol>
                    <MDBCol>
                      <Form.Group controlId="ImageInput" className="mt-3">
                        <Form.Label>Select Image File</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) =>this.onNurseImageChange(e,this)} />
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-2">
                    <MDBCol>
                      <FloatingLabel
                        controlId="NameInput"
                        label="Full Name"
                      >
                        <Form.Control type="text" value={nurse.modal.name} onChange={(e) => this.nurseModalChange('name',e)} placeholder="Full Name" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <FloatingLabel 
                        controlId="AddressInput" 
                        label="Address"
                      >
                        <Form.Control type="text" value={nurse.modal.address} onChange={(e) => this.nurseModalChange('address',e)} placeholder="Address" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow  className="mb-2">
                    <MDBCol md="2">
                      <FloatingLabel
                        controlId="CellInput"
                        label="Cell"
                      >
                        <Form.Control type="number" value={nurse.modal.cell} onChange={(e) => this.nurseModalChange('cell',e)} placeholder="Cell" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol md="2">
                      <FloatingLabel
                        controlId="CodeInput"
                        label="Code"
                      >
                        <Form.Control type="text" value={nurse.modal.code} onChange={(e) => this.nurseModalChange('code',e)} placeholder="Code" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol md='3'>
                      <FloatingLabel 
                        controlId="DateInput" 
                        label="Joining Date"
                      >
                        <Form.Control type="date" value={nurse.modal.date?nurse.modal.date.slice(0,10):''} onChange={(e) => this.nurseModalChange('date',e)} placeholder="Joining Date" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol md="5">
                      <FloatingLabel 
                        controlId="CountryInput" 
                        label="Original Country"
                      >
                        <Form.Control type="text" value={nurse.modal.country} onChange={(e) => this.nurseModalChange('country',e)} placeholder="Original Country" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-2">
                    <MDBCol>
                      <FloatingLabel
                        controlId="ExperienceInput"
                        label="Experience"
                      >
                        <Form.Control type="text" value={nurse.modal.experience} onChange={(e) => this.nurseModalChange('experience',e)} placeholder="Experience" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <FloatingLabel 
                        controlId="SpecialtyInput" 
                        label="Specialty"
                      >
                        <Form.Control type="text" value={nurse.modal.workexp} onChange={(e) => this.nurseModalChange('workexp',e)} placeholder="Specialty" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <Form.Select aria-label="patient select" value={nurse.modal.level} style={{height:'100%'}} onChange = {(e) =>this.nurseModalChange('level',e)}>
                        <option value="" >Select Here</option>
                        <option value="0" >Registered Nurse</option>
                        <option value="1">Assistant Nurse</option>
                      </Form.Select>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-2">
                    <MDBCol>
                      <FloatingLabel
                        controlId="BasicInput"
                        label="Basic Allowance"
                      >
                        <Form.Control type="number" value={nurse.modal.basic_allowances} onChange={(e) => this.nurseModalChange('basic_allowances',e)} placeholder="Basic Allowance" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <FloatingLabel
                        controlId="HousingInput"
                        label="Housing Allowance"
                      >
                        <Form.Control type="number" value={nurse.modal.housing_allowances} onChange={(e) => this.nurseModalChange('housing_allowances',e)} placeholder="Housing Allowance" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <FloatingLabel
                        controlId="OtherInput"
                        label="Other Allowance"
                      >
                        <Form.Control type="number" value={nurse.modal.other_allowances} onChange={(e) => this.nurseModalChange('other_allowances',e)} placeholder="Other Allowance" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                </Modal.Body>
                <Modal.Footer>
                  <MDBBtn type="button" className='btn btn-secondary' onClick={() => this.nurseModal(false)}>
                    Close
                  </MDBBtn>
                  <MDBBtn  type="button" className='btn btn-success' onClick={() => this.nurseConfirm()}>
                    Save
                  </MDBBtn>
                </Modal.Footer>
              </Modal>   

              <Modal show={patient.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.patientModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Patient {patient.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MDBRow className="mb-2 text-center">
                    <MDBCol>
                      <img alt="No Image" src={patient.modal.image} style={{width:'90px',height:'120px'}}></img>
                    </MDBCol>
                    <MDBCol>
                      <Form.Group controlId="ImageInput" className="mt-3">
                        <Form.Label>Select Image File</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) =>this.onPatientImageChange(e,this)} />
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <FloatingLabel
                        controlId="NameInput"
                        label="Full Name"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={patient.modal.name} onChange={(e) => this.patientModalChange('name',e)} placeholder="Full Name" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <FloatingLabel
                        controlId="SpecialtyInput"
                        label="Specialty"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={patient.modal.specialty} onChange={(e) => this.patientModalChange('specialty',e)} placeholder="Full Name" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <FloatingLabel 
                        controlId="AddressInput" 
                        label="Address"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={patient.modal.address} onChange={(e) => this.patientModalChange('address',e)} placeholder="Address" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-3">
                    <MDBCol>
                      <FloatingLabel
                        controlId="CellInput"
                        label="Cell Number"
                      >
                        <Form.Control type="number" value={patient.modal.cell} onChange={(e) => this.patientModalChange('cell',e)} placeholder="Cell Number" />
                      </FloatingLabel>
                    </MDBCol>
                    <MDBCol>
                      <Form.Select aria-label="patient select" value={nurse.modal.level} style={{height:'100%'}} onChange = {(e) =>this.patientModalChange('level',e)}>
                        <option value="" >Select Level</option>
                        <option value="1" >Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                        <option value="5">Office Work</option>
                      </Form.Select>
                    </MDBCol>
                  </MDBRow>
                </Modal.Body>
                <Modal.Footer>
                  <MDBBtn variant="secondary" onClick={() => this.patientModal(false)}>
                    Close
                  </MDBBtn>
                  <MDBBtn variant="success" onClick={() => this.patientConfirm()}>
                    Save
                  </MDBBtn>
                </Modal.Footer>
              </Modal>   
                   
              <Modal show={level.open}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.levelModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Level {level.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <MDBRow>
                    <MDBCol>
                      <FloatingLabel
                        controlId="LevelInput"
                        label="Level"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={level.modal.level} onChange={(e) => this.levelModalChange('level',e)} placeholder="Level" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <FloatingLabel 
                        controlId="RateInput" 
                        label="Rate"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={level.modal.rate} onChange={(e) => this.levelModalChange('rate',e)} placeholder="Rat" />
                      </FloatingLabel>
                    </MDBCol>
                  </MDBRow>
                </Modal.Body>
                <Modal.Footer>
                  <MDBBtn variant="secondary" onClick={() => this.levelModal(false)}>
                    Close
                  </MDBBtn>
                  <MDBBtn variant="success" onClick={() => this.levelConfirm()}>
                    Save
                  </MDBBtn>
                </Modal.Footer>
              </Modal>  
          </MDBContainer>
      )
  }
}

const mapDispatchToProps = (dispatch) => ({
    nurseInsert:(data) =>dispatch(nIns(data)),
    nurseUpdate:(data) =>dispatch(nUpd(data)),
    nurseRemove:(_id) =>dispatch(nDel(_id)),

    patientInsert:(data) =>dispatch(pIns(data)),
    patientUpdate:(data) =>dispatch(pUpd(data)),
    patientRemove:(_id) =>dispatch(pDel(_id)),
    
    levelInsert:(data) =>dispatch(lIns(data)),
    levelUpdate:(data) =>dispatch(lUpd(data)),
    levelRemove:(_id) =>dispatch(lDel(_id)),
    
    holidaySet:(data) =>dispatch(hSet(data)),
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,mapDispatchToProps)(Basic)