import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {MDBCol,MDBContainer,MDBRow } from 'mdb-react-ui-kit';
import { CSVLink } from "react-csv";
import {IoMdDownload} from 'react-icons/io'
import {Form} from 'react-bootstrap';

class PNL extends Component {
  constructor(props) {
      super(props); 

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1);

  
  this.state = {
    selYear:year,
    selMonth:month,
    perPatient:false,
  };     
}

onChangeYear = (e) =>{
this.setState({
  ...this.state,
  selYear:e.target.value,
});
}

levelModalChange = (e) =>{
    this.setState({
      ...this.state,
      selLevel:e.target.value,
    });

}

onChangeMonth = (e) =>{
this.setState({
  ...this.state,
  selMonth:e.target.value,
});
}
 
  viewPerPatient = (e) =>{
    this.setState({
      ...this.state,
      perPatient:!this.state.perPatient
    });
  }

  getTotals(data, key){
    let total = 0;
    data.forEach(item => {
      total += item[key];
    });
    return total;
  }
  getPercentage(row) {
    let percentage = 0;
    if(row.netProfit>0) {
      percentage = (row.netProfit/row.revenue)*100;
    }
    row.percentage = percentage.toFixed(2)+"%";
    return row.percentage;
  }

  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }
  
  render() {
    const {selYear,selMonth,perPatient, selLevel} = this.state;
    const {basic} =this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);
    
    const MonthSelect = Mon.map((month,index) =>
      <option value={NoMon[index]}>{month}</option>
    );

    let pnlColumns = [];
    let pnlDatas = [];

    if(perPatient){
      pnlColumns.push({
        name: "Patient",
        center:true,
        wrap:true,
        sortable:true,
        filterable: true,
        selector: (row) => row.patient
      },{
        name: "Level",
        center:true,
        wrap:true,
        sortable:true,
        selector: (row) => row.level,
      });
    }else{
      pnlColumns.push({
        name: "Month",
        center:true,
        wrap:true,
        selector: (row) => row.month,
      });
    }
    pnlColumns.push({
      name: "Revenue",
      center:true,
      wrap:true,
      selector: (row) => row.revenue?row.revenue.toLocaleString('en'):0,
    },{
      name: "Payroll",
      center:true,
      wrap:true,
      selector: (row) => row.payroll?row.payroll.toLocaleString('en'):0,
    },{
      name: "Profit/Loss",
      center:true,
      wrap:true,
      selector: (row) => row.pnl?row.pnl.toLocaleString('en'):0,
    },
    {
      name: "Percentage",
      center:true,
      wrap:true,
      selector: (row) => this.getPercentage(row),
    }
    );

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
      for(let loopMonth in monthNumbers){
        let daysInMonth = new Date(selYear, loopMonth, 0).getDate();
        let date = selYear+'-'+loopMonth+'-01';
        let firstDate = new Date(date).getDay();
        if(firstDate == 0){firstDate = 1}else{firstDate = 7-firstDate+1}
        for(let selDay = firstDate;selDay < daysInMonth;selDay+=7){
          let day = selDay > 9?selDay:'0'+selDay;
          let key = monthNumbers[loopMonth];
          if(sundaysPerMonth[key] == undefined){sundaysPerMonth[key] = [];}
          sundaysPerMonth[key].push(selYear+'-'+loopMonth+'-'+day);
        }
      }
      //get payroll
      let payrollPerMonth = []; 
      let payrollPerPatient = [];
      let payrollHourly = [];
      let headers = [];

      basic.nurses.map((nurse) =>{
        let salary = nurse.basic_allowances+nurse.housing_allowances+nurse.other_allowances;
  
        //leave days
        let leaves = nurse.leave?nurse.leave:[];
        let leavedaysPerMonth = [];
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
        //rota hours per month
        let rotas = nurse.rota;
        let rotaPerMonth = [];
        let rotaHolidayPerMonth = [];
        rotas.map(rota =>{
          if(rota.date.startsWith(selYear)){
            let month = monthNumbers[[rota.date.slice(5,7)]];
            if(rotaPerMonth[month] == undefined){
              rotaPerMonth[month] = rota.hour;
            }else{
              rotaPerMonth[month] += rota.hour;
            }
            if(holidaysPerMonth[month] && holidaysPerMonth[month].includes(rota.date)){
              if(rotaHolidayPerMonth[month] == undefined){
                rotaHolidayPerMonth[month] = rota.hour;
              }else{
                rotaHolidayPerMonth[month] += rota.hour;
              }
            }

            if(rota.date.slice(5,7) == selMonth){
              if(payrollPerPatient[rota.patient_id] == undefined){payrollPerPatient[rota.patient_id] = []}
              if(payrollPerPatient[rota.patient_id][nurse._id] == undefined){
                payrollPerPatient[rota.patient_id][nurse._id] = rota.hour
              }else{
                payrollPerPatient[rota.patient_id][nurse._id] += rota.hour
              }
            }
          }
        });

        //datatable set
        let offDaysPerMonth = [];
        let dutyHoursPerMonth = [];

        for(let loopMonth in monthNames){
          let daysInMonth = new Date(selYear, monthNames[loopMonth], 0).getDate();
          if(leavedaysPerMonth[loopMonth] == undefined){leavedaysPerMonth[loopMonth] = [];}
          if(holidaysPerMonth[loopMonth] == undefined){holidaysPerMonth[loopMonth] = [];}
          if(sundaysPerMonth[loopMonth] == undefined){sundaysPerMonth[loopMonth] = [];}
          
          offDaysPerMonth[loopMonth] = [...leavedaysPerMonth[loopMonth],...holidaysPerMonth[loopMonth],...sundaysPerMonth[loopMonth]];
          offDaysPerMonth[loopMonth] = [...new Set(offDaysPerMonth[loopMonth])];
          dutyHoursPerMonth[loopMonth] = (daysInMonth-offDaysPerMonth[loopMonth].length)*8;
  
          if(rotaPerMonth[loopMonth] == undefined){rotaPerMonth[loopMonth] = 0;}
          if(rotaHolidayPerMonth[loopMonth] == undefined){rotaHolidayPerMonth[loopMonth] = 0;}
          if(payrollPerMonth[loopMonth] == undefined){payrollPerMonth[loopMonth] = 0;}
          
          if(rotaPerMonth[loopMonth]){
            let basicPerDay = parseFloat(nurse.basic_allowances*15/365/8);
            let holidayPerDay = parseFloat(nurse.basic_allowances*18/365/8);
            let reducePerDay = parseFloat(salary*12/365);

            if(dutyHoursPerMonth[loopMonth] < rotaPerMonth[loopMonth] 
              //  && rotaPerMonth[loopMonth] >= 192
               ){
              let overtime = rotaPerMonth[loopMonth] - dutyHoursPerMonth[loopMonth];
              let holidayovertime = 0;

              if(rotaHolidayPerMonth[loopMonth] != undefined){
                if(overtime <= rotaHolidayPerMonth[loopMonth]){
                  holidayovertime = overtime;
                  overtime = 0;
                }else{
                  overtime -= rotaHolidayPerMonth[loopMonth];
                  holidayovertime = rotaHolidayPerMonth[loopMonth];
                }
              }
              salary += parseInt(basicPerDay*overtime+holidayPerDay*holidayovertime);
            }
            
            if(selYear == parseInt(nurse.date.slice(0,4))){
              let joined = nurse.date;
              if(monthNames[loopMonth] < joined.slice(5,7)){
                salary = 0;
              }else if(monthNames[loopMonth] == joined.slice(5,7)){
                salary = salary - parseInt(reducePerDay*(parseInt(joined.slice(8,10))-1));
              }
            }else if(selYear < parseInt(nurse.date.slice(0,4))){
              salary = 0;
            }

          
          payrollPerMonth[loopMonth] += salary;
          
          
          if(monthNames[loopMonth] == selMonth){
              payrollHourly[nurse._id] = parseFloat(salary/rotaPerMonth[loopMonth]);
          }
        }
        }
      });

    if(perPatient){
      let revenueTotal = 0;
      let payrollTotal = 0;
      basic.patients.map(patient =>{
        let revenue = 0;
        let payroll = 0;
        headers = [
          { label: "Patient", key: "patient" },
          { label: "Level", key: "level" },
          { label: "Revenue", key: "revenue" },
          { label: "Payroll", key: "payroll" },
          { label: "Profit/Loss", key: "pnl" },
        ];

        for(let month in patient.revenue){
          if(month.slice(4,6) == selYear%100 && monthNames[month.slice(0,3)] == selMonth){
            revenue = patient.revenue[month];
            revenueTotal += revenue;
          }
        }
        if(payrollPerPatient[patient._id] == undefined){
          payroll = 0;
        }else{
  
          for(let loopNurse in payrollPerPatient[patient._id]){
            payroll += parseFloat(payrollPerPatient[patient._id][loopNurse] * payrollHourly[loopNurse]);
          }
          payrollTotal += payroll;
        }
          
        pnlDatas.push({
          patient:patient.name,
          level:patient.level,
          revenue:parseInt(revenue),
          payroll:parseInt(payroll),
          pnl:revenue-parseInt(payroll)
        });
        
      });

      let row={
        patient:" Total",
        revenue:revenueTotal,
        payroll:parseInt(payrollTotal),
        pnl:revenueTotal-parseInt(payrollTotal)
      };
      pnlDatas.push(row);
    }else{
      headers = [
        { label: "Month", key: "month" },
        { label: "Revenue", key: "revenue" },
        { label: "Payroll", key: "payroll" },
        { label: "Profit/Loss", key: "pnl" },
      ];
      let revenue = [];
      basic.patients.map(patient =>{
          for(let month in patient.revenue){
            if(month.slice(4,6) == selYear%100){
              let m = month.slice(0,3);
              revenue[m] == undefined 
              ?
              revenue[m] = patient.revenue[month]
              :
              revenue[m] += patient.revenue[month];
            }
          }
      });
      
      for(let month in monthNames){
        if(revenue[month] == undefined){revenue[month] = 0}
        if(payrollPerMonth[month] == undefined){payrollPerMonth[month] = 0}
        pnlDatas.push({
          month:month,
          revenue:revenue[month],
          payroll:payrollPerMonth[month],
          pnl:revenue[month]-payrollPerMonth[month],
        });
      }

      let row={};
      revenue = Object.values(revenue).reduce((a,b) => a+b,0)
      let payroll = Object.values(payrollPerMonth).reduce((a,b) => a+b,0);
      let pnl = revenue - payroll
      row.month = 'Total';
      row.revenue = revenue;
      row.payroll = payroll;
      row.pnl = pnl;
      
      pnlDatas.push(row);
    }

    const conditionalRowStyles = [
        {
          when: (row) => row.month == 'Total' || row.patient == 'Total',
          style: row => ({
            backgroundColor: 'rgb(160,160,160)',
          }),
        }
    ];

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">PROFIT & LOSS</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year" onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            {perPatient &&
            <MDBCol md="2">
                <Form.Group>
                  <Form.Select aria-label="select" value={selMonth} onChange = {(e) =>this.onChangeMonth(e)}>
                    {
                      MonthSelect
                    }
                  </Form.Select>
                </Form.Group>
                </MDBCol>
                }          
            <MDBCol md="2" className='pt-3'>
              <Form.Check 
                checked ={perPatient}
                type="checkbox"
                isValid={true}
                label="Per Patient"
                onChange = {(e) => this.viewPerPatient(e)}
              />
           
            </MDBCol>
             <MDBCol md="2" className="float-right" >
              <CSVLink 
                headers={headers}
                data={pnlDatas}
                filename={"pnl.csv"}
                className="btn btn-success "
                target="_blank"
                >
                <IoMdDownload />Export 
              </CSVLink>
           </MDBCol>
          </MDBRow>
        <MDBRow className='mt-2'>  
            <DataTable
                columns={pnlColumns} 
                data={pnlDatas}
                filter={true}
                fixedHeader
                striped
                conditionalRowStyles={conditionalRowStyles}
                fixedHeaderScrollHeight={'60vh'}
                // pagination
            />

                  
          </MDBRow>
    
      </MDBContainer>
       
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,null)(PNL)