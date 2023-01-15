import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {IoMdDownload} from 'react-icons/io'
import { CSVLink } from "react-csv";
import {Form,OverlayTrigger,Tooltip} from 'react-bootstrap';

class PayRoll extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      
      this.state = {
        selYear:year,
        selMonth:'00',
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
  
  getTotals(data, key){
    let total = 0;
    data.forEach(item => {
      total += item[key];
    });
    return total;
  }

  render() {
    const {selYear,selMonth,selDesignation} = this.state;
    const {basic} =this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);   
    const MonthSelect = Mon.map((month,index) =>
      <option value={NoMon[index]}>{month}</option>
    );
     
    let payrollColumns = [];

    if(selMonth != "00"){
      payrollColumns.push({
        name: "ID",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row['code'],
      },{
        name: "Name",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['name'],
      },{
        name: "Designation",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['designation'],
      },{
        name: "Month(d)",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row['monthdays'],
      },{
        name: "Worked(d)",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row['workeddays'],
      },{
        name: "Worked(h)",
        center:true,
        wrap:true,
        width:'80px',
        selector: (row) => row['totalhoursworked'],
      },{
        name: "NormalOver(h)",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['normalovertimehours'],
      },{
        name: "HolidayOver(h)",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['holidayovertimehours'],
      },{
        name: "GrossSalary",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['grosssalary'],
      },{
        name: "NormalOvertime",
        center:true,
        wrap:true,
        width:'120px',
        selector: (row) => row['normalovertime'],
      },{
        name: "HolidayOvertime",
        center:true,
        wrap:true,
        width:'150px',
        selector: (row) => row['holidayovertime'],
      });
    }else{
      payrollColumns.push({
        name: "Nurse",
        center:true,
        wrap:true,
        selector: (row) => row['nurse'],
      });
      payrollColumns.push({
        name: "Designation",
        center:true,
        wrap:true,
        selector: (row) => row['designation'],
      });
      for(let month in monthNames){      
        payrollColumns.push({
          name:month,
          center:true,
          wrap:true,
          width:'70px',
          cell: (row) =>
          <OverlayTrigger
            key={row._id}
            placement="top"
            overlay={
              <Tooltip  className="display-linebreak" style={{position:'fixed'}} >
                {row[month+"comment"]}
              </Tooltip>
            }
          >
            <p className="payroll hover">{row[month]?row[month].toLocaleString('en'):0}</p>
          </OverlayTrigger>
        });
      }
    }

    payrollColumns.push({
      name: "Total",
      center:true,
      wrap:true,
      width:'80px',
      selector: (row) => row['total']?row['total'].toLocaleString('en'):0,
    });

    let payrollDatas = [];
    let headers = [];
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
    
    if(selYear <= new Date().getFullYear()){
      basic.nurses.map((nurse) =>{
        let basicPerDay = parseFloat(nurse.basic_allowances*15/365/8);
        let holidayPerDay = parseFloat(nurse.basic_allowances*18/365/8);
        let reducePerDay;

        if(selDesignation == "-1" || parseInt(nurse.level) == selDesignation){
          let salary = nurse.basic_allowances+nurse.housing_allowances+nurse.other_allowances;
          reducePerDay = parseFloat(salary*12/365);
          let comment = "basic:"+nurse.basic_allowances+"\nhousing:"+nurse.housing_allowances+"\nother:"+nurse.other_allowances;
    
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
          let rotaPerMonth = [],rotaHolidayPerMonth = [];
          let workeddays = [],totalhoursworked = 0;
         
          //rota calculate
          rotas.map(rota =>{
            if(rota.date.startsWith(selYear)){
              let month = monthNumbers[[rota.date.slice(5,7)]];
              if(monthNames[month] == selMonth){workeddays.push(rota.date);totalhoursworked += rota.hour;}
              
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
            }
          });
       
          //datatable set
          let payrollPerMonth = [],payrollCommentPerMonth = [],offDaysPerMonth = [],dutyHoursPerMonth = [];
          let monthdays,normalovertimehours,holidayovertimehours,grosssalary,normalovertime,holidayovertime,totalsalary;

          for(let loopMonth in monthNames){         
            let daysInMonth = new Date(selYear, monthNames[loopMonth], 0).getDate();
            if(monthNames[loopMonth] == selMonth){monthdays = daysInMonth;}

            if(leavedaysPerMonth[loopMonth] == undefined){leavedaysPerMonth[loopMonth] = [];}
            if(holidaysPerMonth[loopMonth] == undefined){holidaysPerMonth[loopMonth] = [];}
            if(sundaysPerMonth[loopMonth] == undefined){sundaysPerMonth[loopMonth] = [];}
            
            offDaysPerMonth[loopMonth] = [...leavedaysPerMonth[loopMonth],...holidaysPerMonth[loopMonth],...sundaysPerMonth[loopMonth]];
            offDaysPerMonth[loopMonth] = [...new Set(offDaysPerMonth[loopMonth])];
            dutyHoursPerMonth[loopMonth] = (daysInMonth-offDaysPerMonth[loopMonth].length)*8;
            if(rotaPerMonth[loopMonth] == undefined){rotaPerMonth[loopMonth] = 0;}
            //extra salary calculate
            if(dutyHoursPerMonth[loopMonth] < rotaPerMonth[loopMonth]
              //  && rotaPerMonth[loopMonth] >= 192
              ){
              let overtime = rotaPerMonth[loopMonth] - dutyHoursPerMonth[loopMonth];
              let hovertime = 0;

              if(rotaHolidayPerMonth[loopMonth] != undefined){
                if(overtime <= rotaHolidayPerMonth[loopMonth]){
                  hovertime = overtime;
                  overtime = 0;
                }else{
                  overtime -= rotaHolidayPerMonth[loopMonth];
                  hovertime = rotaHolidayPerMonth[loopMonth];
                }
              }
              
              payrollPerMonth[loopMonth] = salary+parseInt(basicPerDay*overtime+holidayPerDay*hovertime);
              payrollCommentPerMonth[loopMonth] = comment+"\novertime:"+overtime+"hours"+"\nholiday overtime:"+hovertime+"hours";
              
              if(monthNames[loopMonth] == selMonth){
                normalovertimehours = overtime;
                holidayovertimehours = hovertime;
                normalovertime = basicPerDay*overtime;
                holidayovertime = holidayPerDay*hovertime;
                grosssalary = salary;
                totalsalary = payrollPerMonth[loopMonth]
              }
            //commmon salary
            }else{
              payrollPerMonth[loopMonth] = salary;
              payrollCommentPerMonth[loopMonth] = comment;

              if(selYear == parseInt(nurse.date.slice(0,4))){
                let joined = nurse.date;
                if(monthNames[loopMonth] < joined.slice(5,7)){
                  payrollPerMonth[loopMonth] = 0;
                }else if(monthNames[loopMonth] == joined.slice(5,7)){
                  payrollPerMonth[loopMonth] = salary - parseInt(reducePerDay*(parseInt(joined.slice(8,10)-1)));
                }
              }else if(selYear < parseInt(nurse.date.slice(0,4))){
                payrollPerMonth[loopMonth] = 0;
              }
            
              if(monthNames[loopMonth] == selMonth){
                normalovertimehours = 0;
                holidayovertimehours = 0;
                normalovertime = 0;
                holidayovertime = 0;
                grosssalary = salary;
                totalsalary = payrollPerMonth[loopMonth];
              }
            }
          }   
          
          let row = {};
          row.nurse = nurse.name;
          row.designation = nurse.level==0?"Registered":"Assistant";
          //all data
          if(selMonth == "00"){           
            let grandTotal = 0;
            for(let month in monthNames){
              if(selYear == new Date().getFullYear()){
                if(parseInt(monthNames[month]) <= new Date().getMonth()+1){
                  row[month] = payrollPerMonth[month];
                  row[month+'comment'] = payrollCommentPerMonth[month];
                  grandTotal += row[month];
                }else{
                  row[month] = 0;
                }
              }else if(selYear < new Date().getFullYear()){
                row[month] = payrollPerMonth[month];
                row[month+'comment'] = payrollCommentPerMonth[month];
                grandTotal += row[month];
              }
            }
            row.total = grandTotal;
            payrollDatas.push(row);
          //detail month data
          }else{
            workeddays = [...new Set(workeddays)];

            row.code = nurse.code;
            row.name = nurse.name;
            row.designation = nurse.level==0?"Registered":"Assistant";
            row.monthdays = monthdays;
            row.workeddays = workeddays.length;
            row.totalhoursworked = totalhoursworked;
            row.normalovertimehours = normalovertimehours;
            row.holidayovertimehours = holidayovertimehours;
            row.grosssalary = grosssalary;
            row.normalovertime = parseInt(normalovertime);  
            row.holidayovertime = parseInt(holidayovertime);
            row.total = totalsalary;
            
            payrollDatas.push(row);
          }
        }
      });
      let total = {
        nurse:'Total',
        code:'Total',
      }
      // payrollDatas.push(total);
      if(selMonth != "00"){    headers = [
        { label: "ID", key: "code" },
        { label: "Name", key: "name" },
        { label: "Designation", key: "designation" },
        { label: "Worked Days", key: "workeddays" },
        { label: "Worked Hours", key: "totalhoursworked" },
        { label: "NormalOver(h)", key: "normalovertimehours" },
        { label: "HolidayOver(h)", key: "holidayovertimehours" },
        { label: "GrossSalary", key: "grosssalary" },
        { label: "NormalOvertime", key: "normalovertime" },
        { label: "HolidayOvertime", key: "holidayovertime" },
        { label: "Total", key: "total" }
      ];
        for(let month in monthNames){      
        }
      } else {    
        for(let month in monthNames){   
          total[month] = this.getTotals(payrollDatas,month); 
          total['total'] = this.getTotals(payrollDatas,'total'); 
          headers = [
            { label: "Nurse", key: "nurse" },
            { label: "Designation", key: "designation" },
            { label: "Jan", key: "Jan" },
            { label: "Feb", key: "Feb" },
            { label: "Mar", key: "Mar" },
            { label: "Apr", key: "Apr" },
            { label: "May", key: "May" },
            { label: "Jun", key: "Jun" },
            { label: "Jul", key: "Jul" },
            { label: "Aug", key: "Aug" },
            { label: "Sep", key: "Sep" },
            { label: "Oct", key: "Oct" },
            { label: "Nov", key: "Nov" },
            { label: "Dec", key: "Dec" },
            { label: "Total", key: "total" }
          ];
          
        }
      }
    }
    
    const conditionalRowStyles = [
      {
        when: (row) => row.designation == 'Total',
        style: row => ({
          backgroundColor: 'rgb(160,160,160)',         
        }),
      }
    ];
  
    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">PAY ROLL</h1>
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
              <MDBCol md="2" >
              <CSVLink
                data={payrollDatas}
                headers={headers}
                filename={"payroll.csv"}
                className="btn btn-success "
                target="_blank"
                >
                <IoMdDownload />Export 
              </CSVLink>
           </MDBCol>         
          </MDBRow>
          <MDBRow className='mt-2'>   
            <DataTable
                columns={payrollColumns} 
                data={payrollDatas}
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

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(PayRoll)