import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow,MDBBtn
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { read, utils } from 'xlsx';
import axios from '../config/server.config'
import { pAllUpd } from '../store/Actions/BasicAction';


class Revenue extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      
      this.state = {
        selYear:year,
        file:''
      };
  }
  componentDidMount() {
  }

  onImportPatients = (e) =>{
    const files = e.target.files;
    if (files.length) {
        const file = files[0];
        this.setState({
          ...this.state,
          file:file
        });
    }
  }
  submit = () =>{
    var _self = this;
    if(this.state.file){
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        let revenueSheet = sheets.indexOf('Revenue');
        if(revenueSheet != -1){
          const rows = utils.sheet_to_json(wb.Sheets[sheets[revenueSheet]]);
          axios.post('patient/import',{
            importData:rows
          })
          .then(function (response) {
            let notFound = response.data.notFound;
            let data = response.data;
            if(notFound.length != 0){
              toastr.warning("Not Found These Patients:"+notFound.join(","));
            }
            _self.props.getImportData(data);
          })
          .catch(function (error) {
          });
        }
      }
      reader.readAsArrayBuffer(this.state.file);
    }
    else{
      toastr.info("Please select import file!");
    }
  }
  onChangeYear = (e) =>{
    this.setState({
      ...this.state,
      selYear:e.target.value,
    });
  }
  getTotals(data, key){
    let total = 0;
    data.forEach(item => {
      total += item[key]?item[key]:0;
    });
    return total;
  }

  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }

  render() {
    const {selYear} = this.state;
    const {basic} =this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    
    let revenueColumns = [];
    revenueColumns.push({
      name: "Revenue",
      center:true,
      wrap:true,
      selector: (row) => row.patient,
    });
    for(let month in monthNames){
      revenueColumns.push({
        name:month,
        center:true,
        wrap:true,
        width:'75px',
        selector: (row) => row[month]?row[month].toLocaleString('en'):'',
      });
    }
    revenueColumns.push({
      name: "Total",
      center:true,
      wrap:true,
      selector: (row) => row.total?row.total.toLocaleString('en'):'',
    });

    let revenueDatas = [];

    basic.patients.map(patient =>{
      let row=[];
      let total = 0;
      row['patient'] = patient.name;
      if(patient.revenue != undefined){
        for(let month in patient.revenue){
          if(month.slice(4,6) == selYear%100){
            let monthName = month.slice(0,3);
            row[monthName] = patient.revenue[month]
            total += patient.revenue[month];
          }
        }
      }
      row['total'] = total;
      revenueDatas.push(row);
    });

    let total = {
      patient:'Total',
    }
    for(let month in monthNames){
      total[month] = this.getTotals(revenueDatas,month);
    }
    total['total'] = this.getTotals(revenueDatas,'total');
    revenueDatas.push(total);

    const conditionalRowStyles = [
        {
          when: (row) => row.patient == 'total',
          style: row => ({
            backgroundColor: 'rgb(160,160,160)',
          }),
        }
    ];

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">REVENUE</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year" onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            <MDBCol md="3">
                <Form.Group controlId="ImageInput">
                <Form.Control type="file" accept=".xlsx" onChange={(e) =>this.onImportPatients(e,this)} />
                </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <MDBBtn outline rounded  color='success' onClick={() =>this.submit()}>SUBMIT</MDBBtn>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-2'>   
            <DataTable
                columns={revenueColumns} 
                data={revenueDatas}
                fixedHeader
                striped
                conditionalRowStyles={conditionalRowStyles}
                fixedHeaderScrollHeight={'60vh'}
                pagination
            />
          </MDBRow>
      </MDBContainer>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  getImportData:(data) =>dispatch(pAllUpd(data))
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,mapDispatchToProps)(Revenue)