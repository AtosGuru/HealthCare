import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTableSelected from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow,  
  MDBModalHeader
  
} from 'mdb-react-ui-kit';
import {Button, Form,OverlayTrigger,Tooltip} from 'react-bootstrap';

class FTE extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+(date.getMonth()+1);
      let day = new Date(year,month,0).getDate();
      
      this.state = {
        selYear:year,
        selMonth:'00',
        type:0,
        from:year+'-'+month+'-'+'01',
        to:year+'-'+month+'-'+day,
        selNurse:0,
        selDesignation:-1
      };
  }
  componentDidMount() {
  }

  onChangeYear = (e) =>{
    this.setState({
      ...this.state,
      selYear:e.target.value,
    });
  }
  setDate = (target,e) =>{
    this.setState({
      ...this.state,
      [target]:e.target.value
    });
  }
    onChangeNurse = (e) =>{
    this.setState({
      ...this.state,
      selNurse:e.target.value,
    });
  }
  onChangeMonth = (e) =>{
    this.setState({
      ...this.state,
      selMonth:e.target.value,
    });
  }
  onChangeDesignation = (e) =>{
    this.setState({
      ...this.state,
      selDesignation:e.target.value,
    });
  }
  
 
  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }

  render() {
    const {selYear,selMonth,from,to,selDesignation, selNurse} = this.state;
    const {basic} =this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);   
    const MonthSelect = Mon.map((month,index) =>
      <option value={NoMon[index]}>{month}</option>
    );

    
    let FTEColumns = [
      {
        name: "Emp Code",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.code,
      },
      {
        name: "Name",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row.name,
      },
      {
        name: "Designation",
        center:true,
        wrap:true,
        selector: (row) => row.designation,
      },
      {
         name: "Month(D)",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.days,
      },
    //   {
    //     name: "Date",
    //    center:true,
    //    wrap:true,
    //    width:'100px',
    //    selector: (row) => row.date,
    //  },
      {
        name: "Sundays",
        center:true,
        selector: (row) => row.sundays,
      },
      {
        name: "Holidays",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.holidays,
      },
      {
        name: "Leave Days",
        center:true,
        wrap:true,
        selector: (row) => row.leavedays,
      },

      {
        name: "Net Working Days",
        center:true,
        selector: (row) => row.workingdays,
      },
      {
        name: "Working(HA",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row.totalhours,
      },
      {
        name: "daily Hours",
        center:true,
        wrap:true,
        selector: (row) => row.hours,
      },
           {
        name: "Worked(h)",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row.hour,
      },
      {
          name: "Overtime",
          center:true,
          wrap:true,
          width:'120px',
          selector: (row) => row.hour - row.hours,
        },
    ];
 
  
    let FTEDatas = [];
    if(selYear <= new Date().getFullYear()){
      basic.nurses.map((nurse) =>{
        if(selNurse == "0" || parseInt(nurse._id) == selNurse){
        // if(selDesignation == "-1" || parseInt(nurse.level) == selDesignation){
         
    let leaves = [];

    let leavedaysPerMonth = [];
        basic.nurses.map(nurse =>{
      if(nurse._id == selNurse){
        leaves = nurse.leave;
      }
    });
    //show data per individual
    let dates = [];
    for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
        let year = d.getFullYear();
        let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
        let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
        let dateFormat = year+'-'+month+'-'+day;
        dates.push(dateFormat);
      }
   
    basic.nurses.map(nurse =>{
      if(nurse._id == selNurse){
    for(let leave of leaves){
      let from = new Date(leave.from);
      let to = new Date(leave.to);
      for(let betweenDay = from;betweenDay <= to;){
        let year = betweenDay.getFullYear();
        let month = betweenDay.getMonth()+1>9?betweenDay.getMonth()+1:'0'+(betweenDay.getMonth()+1);
        let day = betweenDay.getDate()>9?betweenDay.getDate():'0'+betweenDay.getDate();
        if(year == selYear){
          let key = monthNumbers[month];
          if(leavedaysPerMonth[key] == undefined){leavedaysPerMonth[key] = [];}
          leavedaysPerMonth[key].push(year+'-'+month+'-'+day);
        }
        betweenDay.setDate(betweenDay.getDate() + 1);
      }
    }
  }
});
    //get holidays per month
    let holidays = basic.holidays;
    let holidaysPerMonth = [];
    holidays.map(holiday =>{
      let key = monthNumbers[holiday.slice(0,2)];
      if(holidaysPerMonth[key] == undefined){holidaysPerMonth[key] = [];}
      holidaysPerMonth[key].push(selYear+'-'+holiday);
    });
    //get sundays per month
    let sundaysPerMonth = [];
    for(let selMonth in monthNumbers){
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();
      let date = selYear+'-'+selMonth+'-01';
      let firstDate = new Date(date).getDay();
      if(firstDate == 0){firstDate = 1}else{firstDate = 7-firstDate+1}
      for(let selDay = firstDate;selDay < daysInMonth;selDay+=7){
        let day = selDay > 9?selDay:'0'+selDay;
        
        let key = monthNumbers[selMonth];
        if(sundaysPerMonth[key] == undefined){sundaysPerMonth[key] = [];}
        sundaysPerMonth[key].push(selYear+'-'+selMonth+'-'+day);
      }
    }
    

    for(let selMonth in monthNames){
      let daysInMonth = new Date(selYear, monthNames[selMonth], 0).getDate();

      if(leavedaysPerMonth[selMonth] == undefined){leavedaysPerMonth[selMonth] = [];}
      if(holidaysPerMonth[selMonth] == undefined){holidaysPerMonth[selMonth] = [];}
      if(sundaysPerMonth[selMonth] == undefined){sundaysPerMonth[selMonth] = [];}
      let offDays = [
        ...leavedaysPerMonth[selMonth],
        ...holidaysPerMonth[selMonth],
        ...sundaysPerMonth[selMonth]];
      offDays = [...new Set(offDays)];

      nurse.rota.map((rota)=>{
        if(rota.date){
      let row={
        month:selMonth,
        code: nurse.code,
        hour:rota.hour,
        date:rota.date,
        name: nurse.name,
        days:daysInMonth,
        designation : nurse.level==0?"Registered":"Assistant",
        sundays:sundaysPerMonth[selMonth].length,
        holidays:holidaysPerMonth[selMonth].length,
        leavedays:leavedaysPerMonth[selMonth].length,
        workingdays:daysInMonth - offDays.length,
        hours:8,
        totalhours:8*(daysInMonth - offDays.length)
      };
   
            FTEDatas.push(row);
    }
          });
    } 
          }
        
          }
        
      );
    }


    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">(FTE)</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Select aria-label="select" value={selDesignation} onChange = {(e) =>this.onChangeDesignation(e)}>
                <option value="-1">All</option>
                <option value="0">Registered</option>
                <option value="1">Assistant</option>
              </Form.Select>
            </MDBCol>
            <MDBCol md="2">
            <Form.Group>
                    <Form.Select aria-label="select" value={selNurse} onChange = {(e) =>this.onChangeNurse(e)}>
                      <option value="0" >Select Nurse</option>
                      {
                        basic.nurses.map((value,index) =>{
                          return <option key = {index} value={value._id}>{value.name}</option>
                        })
                      }
                    </Form.Select>
                  </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year" onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <Form.Select aria-label="select" value={selMonth} onChange = {(e) =>this.onChangeMonth(e)}>
                <option value="00">Month</option>
                {
                  MonthSelect
                }
              </Form.Select>
            </MDBCol>
          </MDBRow>
          <  MDBModalHeader>   
            <DataTableSelected
                columns={FTEColumns} 
                data={FTEDatas}
                fixedHeader
                striped
                fixedHeaderScrollHeight={'60vh'}
            />
          </MDBModalHeader>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(FTE)