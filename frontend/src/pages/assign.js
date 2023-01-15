import React, { Component } from 'react';
import './../App.css';
import axios from 'axios'
import {Form} from 'react-bootstrap';
import { MDBContainer } from 'mdb-react-ui-kit';
import DataTable from 'react-data-table-component';
import {connect} from 'react-redux'

import {
  npUpd
} from '../store/Actions/BasicAction';

// import toastr from 'toastr'
// import 'toastr/build/toastr.min.css'


class Assign extends Component {

  constructor(props) {
      super(props);
      this.state = {
        isEditable:false,
        selPatient:0,
        selYear:new Date().getFullYear(),
        selMonth:new Date().getMonth()+1,
        assigns:[],
      };
  }

  componentDidMount() {
  }

  save = () =>{
    const {basic} = this.props;
    const {isEditable,selPatient,selYear,selMonth,assigns} = this.state;
    if(isEditable){
      const _self = this;
      this.setState({
        ...this.state,
        isEditable:false,
      });
      
      axios.post('rota/assign',{
        patient_id:selPatient,
        year:selYear,
        month:selMonth,
        assignData:assigns
      })
      .then(function (response) {
        _self.props.assign(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    }else{
      let assigns = [];
      let newAssign = [];
      let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();
      if(selPatient !== 0){
        for(let i = 0; i < daysInMonth;i++){
          newAssign.day = (i+1);
          newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
          newAssign.nurse_name = 'NA';
          newAssign.nurse_short_id = 'NA';
          newAssign.nurse_id = 'NA';
          newAssign.designation = 'NA';
          newAssign.duty_start = 'NA';
          newAssign.duty_end = 'NA';
          newAssign.hour = 'NA';
  
          assigns = [...assigns,{...newAssign}];
        }
        
        basic.patients.map(patient =>{
          if(patient._id === selPatient){
            patient.rota.map(rota =>{
              if(rota.date.includes(month)){
                basic.nurses.map(nurse =>{
                  if(rota.nurse_id == nurse._id){
                    nurse.rota.map(nurseRota =>{
                      if(nurseRota.date === rota.date){
                        let day = rota.date.replace(month+'-','')
                        assigns[day-1] = {
                          day:day*1,
                          date:rota.date,
                          nurse_name:nurse.name,
                          nurse_id:nurse._id,
                          nurse_short_id:nurse._id.slice(20),
                          designation:nurseRota.level,
                          duty_start:nurseRota.duty_start,
                          duty_end:nurseRota.duty_end,
                          hour:nurseRota.hour,
                        };
                      }
                    });
                  }
                })
              }
            })
          }
        });
      }

      this.setState({
        ...this.state,
        isEditable:true,
        assigns:[...assigns]
      })
    }
  };

  onChangePatient = (e) =>{
    this.setState({
      ...this.state,
      selPatient:e.target.value,
      isEditable:false,
    });
  }
  onChangeYear = (e) =>{
    this.setState({
      ...this.state,
      selYear:e.target.value,
    });
  }
  onChangeMonth = (e) =>{
    this.setState({
      ...this.state,
      selMonth:e.target.value,
    });
  }
  onChangeNurse = (e,row) =>{
    const {basic} = this.props;

    basic.nurses.map((nurse,index) =>{
      if(nurse._id == e.target.value){
        this.state.assigns[row.day-1].nurse_name = nurse.name;
        this.state.assigns[row.day-1].nurse_id = nurse._id;
        this.state.assigns[row.day-1].nurse_short_id = nurse._id.slice(20);
      }
    })
    this.setState({
      ...this.state,
      assigns:[...this.state.assigns]
    });
  }
  onChangeDutyStart = (e,row) =>{
    const {basic} = this.props;
    basic.nurses.map((nurse,index) =>{
      if(nurse._id == row.nurse_id){
        this.state.assigns[row.day-1].duty_start = e.target.value;
        if(this.state.assigns[row.day-1].duty_end != 'NA'){
          this.state.assigns[row.day-1].hour = Math.abs(this.state.assigns[row.day-1].duty_end.split(':')[0]-this.state.assigns[row.day-1].duty_start.split(':')[0]);
        }
      }
    })
    this.setState({
      ...this.state,
      assigns:[...this.state.assigns]
    });
  }
  onChangeDutyEnd = (e,row) =>{
    const {basic} = this.props;
    basic.nurses.map((nurse,index) =>{
      if(nurse._id == row.nurse_id){
        this.state.assigns[row.day-1].duty_end = e.target.value;
        if(this.state.assigns[row.day-1].duty_start != 'NA'){
          this.state.assigns[row.day-1].hour = Math.abs(this.state.assigns[row.day-1].duty_end.split(':')[0]-this.state.assigns[row.day-1].duty_start.split(':')[0]);
        }
      }
    })
    this.setState({
      ...this.state,
      assigns:[...this.state.assigns]
    });
  }


  render() {
    const {basic} = this.props;
    const {selPatient,selMonth,selYear,isEditable,assigns} = this.state;

    let assignColumns = [];
    let assignDatas =[];
    let newAssign = [];

    if(isEditable){
      assignColumns =[{
          name: "Days",
          center:true,
          wrap:true,
          selector: (row) => row.day,
        },
        {
          name: "Date",
          center:true,
          wrap:true,
          selector: (row) => row.date,
        },
        {
          name: "Emp Name",
          center:true,
          wrap:true,
          width:'200px',
          cell: (row) => [
            <Form.Select aria-label="patient select" value={row._nurse_id} onChange = {(e) =>this.onChangeNurse(e,row)}>
              <option value="0" >Select Nurse</option>
              {
                basic.nurses.map((nurse,index) =>{
                  return <option key = {index} value={nurse._id} selected ={nurse._id == row.nurse_id?"selected":''}>{nurse.name}</option>
                })
              }
            </Form.Select>],
        },
        {
          name: "Emp ID",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_short_id,
        },
        {
          name: "Designation",
          center:true,
          wrap:true,
          width:'100px',
          selector: (row) => row.designation,
        },
        {
          name: "Duty Start",
          center:true,
          wrap:true,
          width:'160px',
          cell: (row) => [
            <Form.Group>
              <Form.Control type="time" value={row.duty_start} disabled={row.nurse_id=="NA"?'disabled':''} onChange = {(e) =>this.onChangeDutyStart(e,row)}/>
            </Form.Group>
          ]
        },
        {
          name: "Duty End",
          center:true,
          wrap:true,
          width:'160px',
          selector: (row) => [
            <Form.Group>
              <Form.Control type="time" value={row.duty_end} disabled={row.nurse_id=="NA" ?'disabled':''}  onChange = {(e) =>this.onChangeDutyEnd(e,row)}/>
            </Form.Group>
          ]
        },
        {
          name: "Hour",
          center:true,
          wrap:true,
          width:'80px',
          selector: (row) => row.hour,
        },
      ];

      assignDatas = assigns;
    }else{
      assignColumns =[{
          name: "Days",
          center:true,
          wrap:true,
          selector: (row) => row.day,
        },
        {
          name: "Date",
          center:true,
          wrap:true,
          selector: (row) => row.date,
        },
        {
          name: "Emp Name",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_name,
        },
        {
          name: "Emp ID",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_short_id,
        },
        {
          name: "Designation",
          center:true,
          wrap:true,
          selector: (row) => row.designation,
        },
        {
          name: "Duty Start",
          center:true,
          wrap:true,
          selector: (row) => row.duty_start,
        },
        {
          name: "Duty End",
          center:true,
          wrap:true,
          selector: (row) => row.duty_end,
        },
        {
          name: "Hour",
          center:true,
          wrap:true,
          selector: (row) => row.hour,
        },
      ];
      
      let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);
      let daysInMonth = new Date(selYear, selMonth, 0). getDate();
  
      if(selPatient != 0){
        for(let i = 0; i < daysInMonth;i++){
          newAssign.day = (i+1)*1;
          newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
          newAssign.nurse_name = 'NA';
          newAssign.nurse_short_id = 'NA';
          newAssign.nurse_id = 'NA';
          newAssign.designation = 'NA';
          newAssign.duty_start = 'NA';
          newAssign.duty_end = 'NA';
          newAssign.hour = 'NA';
    
          assignDatas = [...assignDatas,{...newAssign}];
        }
        
        basic.patients.map((patient) =>{
          if(patient._id == selPatient){
            patient.rota.map((rota) =>{
              if(rota.date.includes(month)){
                basic.nurses.map((nurse) =>{
                  if(rota.nurse_id == nurse._id){
                    nurse.rota.map((nurseRota) =>{
                      if(nurseRota.date == rota.date){
                        let day = rota.date.replace(month+'-','')
                        assignDatas[day-1] = {
                          day:day*1,
                          date:rota.date,
                          nurse_name:nurse.name,
                          nurse_id:nurse._id,
                          nurse_short_id:nurse._id.slice(20),
                          designation:nurseRota.level,
                          duty_start:nurseRota.duty_start,
                          duty_end:nurseRota.duty_end,
                          hour:nurseRota.hour,
                        };
                      }
                    });
                  }
                })
              }
            })
          }
        });
      }
    }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">ROTA SYSTEM</h1>
        </div>
        <div className="row lex align-items-center justify-content-center">
          <div className="col-md-3 col-xs-5">
            <Form.Group>
              <Form.Select aria-label="patient select" value={selPatient} onChange = {(e) =>this.onChangePatient(e)}>
                <option value="0" >Select Patient</option>
                {
                  basic.patients.map((value,index) =>{
                    return <option key = {index} value={value._id}>{value.name}</option>
                  })
                }
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-2 col-xs-3">
            <Form.Group>
              <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} max={new Date().getFullYear()} onChange = {(e) =>this.onChangeYear(e)}/>
            </Form.Group>
          </div>
          <div className="col-md-2 col-xs-3">
            <Form.Group>
              <Form.Control type="number" value={selMonth} placeholder="Month" min={1} max={12}  onChange = {(e) =>this.onChangeMonth(e)}/>
            </Form.Group>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-success" onClick={() =>this.save()}>{isEditable?'save':'edit'}</button>
          </div>
        </div>
        <div className='row p-2'>
          <DataTable 
            columns={assignColumns} 
            data={assignDatas}
            fixedHeader
            fixedHeaderScrollHeight={'60vh'}
            pagination />
        </div>
      </MDBContainer>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  assign:(data) =>dispatch(npUpd(data))
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,mapDispatchToProps)(Assign)
