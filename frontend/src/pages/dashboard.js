import React, { Component } from 'react';
import './../css/App.css';
import {connect} from 'react-redux'
import {
  MDBCol,MDBContainer,MDBRow,MDBCard,MDBCardBody,MDBCardImage,MDBCardTitle,MDBProgress,MDBProgressBar
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';
import {CWidgetStatsB
} from '@coreui/react';

import { CChart } from '@coreui/react-chartjs';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1);
    
    this.state = {
      selYear:year,
      selMonth:month
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
  
  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }

  render() {
    const {selYear,selMonth} = this.state;
    const {basic} =this.props;

    console.log(this.props.basic);

    let nurseDatas = [{
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    }];

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);
    
    const MonthSelect = Mon.map((month,index) =>
      <option value={NoMon[index]}>{month}</option>
    );

    let daysInMonth = new Date(selYear, selMonth, 0). getDate();
    let from = selYear+'-'+selMonth+'-01';
    let to = selYear+'-'+selMonth+'-'+daysInMonth;

    //get holidays per month
    let holidays = basic.holidays;
    let holidaysInMonth = [];
    let holidaysPerMonth = [];

    holidays.map(holiday => {
      let key = monthNumbers[holiday.slice(0,2)];
      if(holidaysPerMonth[key] === undefined){holidaysPerMonth[key] = [];}
      holidaysPerMonth[key].push(selYear+'-'+holiday);

      if(parseInt(holiday.slice(0,2)) === selMonth){
        holidaysInMonth.push(selYear+'-'+holiday);
      }
    });
    
    //get sundays in month
    let SundaysInMonth = [];
    
    let date = selYear+'-'+selMonth+'-01';
    let firstDate = new Date(date).getDay();
    if(firstDate == 0){firstDate = 7}
    for(let selDay = firstDate;selDay < daysInMonth;selDay+=7){
      let day = selDay > 9?selDay:'0'+selDay;
      SundaysInMonth.push(selYear+'-'+selMonth+'-'+day);
    }
    
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
    
    //get average duty hour
    let rotaHourPerMonth = [];
    let rotaHourPerDay = [];

    rotaHourPerMonth[0] = [];
    rotaHourPerMonth[1] = [];
    rotaHourPerMonth[2] = [];
    rotaHourPerDay[0] = [];
    rotaHourPerDay[1] = [];
    rotaHourPerDay[2] = [];

    basic.nurses.map((nurse) => {
      let salary = nurse.basic_allowances+nurse.housing_allowances+nurse.other_allowances;
      let nurseLevel = nurse.level;

        nurseDatas[nurseLevel].members++;
        nurseDatas[2].members++;
        
        let rotas = nurse.rota;
        let rotaPerMonth = [];
        let rotaHolidayPerMonth = [];

        rotas.map((rota) =>{
          if(rota.date >= from && rota.date <= to){
            nurseDatas[nurseLevel].assigned += rota.hour*1;
            nurseDatas[2].assigned += rota.hour*1;
          }
          if(rota.date.startsWith(selYear)){
            let monthnum = parseInt(rota.date.slice(5,7));
            let month = monthNumbers[[rota.date.slice(5,7)]];
            let day = parseInt(rota.date.slice(8,10));
            if(rotaPerMonth[month] == undefined){
              rotaPerMonth[month] = rota.hour;
            }else{
              rotaPerMonth[month] += rota.hour;
            }

            if(rotaHourPerMonth[nurseLevel][monthnum] == undefined){
              rotaHourPerMonth[nurseLevel][monthnum] = rota.hour;
            }else{
              rotaHourPerMonth[nurseLevel][monthnum] += rota.hour;
            }
            if(rotaHourPerMonth[2][monthnum] == undefined){
              rotaHourPerMonth[2][monthnum] = rota.hour;
            }else{
              rotaHourPerMonth[2][monthnum] += rota.hour;
            }

            if(rota.date.startsWith(selYear+'-'+selMonth)){
              if(rotaHourPerDay[nurseLevel][day] == undefined){
                rotaHourPerDay[nurseLevel][day] = rota.hour;
              }else{
                rotaHourPerDay[nurseLevel][day] += rota.hour;
              }
              if(rotaHourPerDay[2][day] == undefined){
                rotaHourPerDay[2][day] = rota.hour;
              }else{
                rotaHourPerDay[2][day] += rota.hour;
              }
            }
            
            if(holidaysPerMonth[month] != undefined && holidaysPerMonth[month].includes(rota.date)){
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

        //get leavedays per month
        let leaves = nurse.leave;
        let leavedaysPerMonth = [];

        for(let leave of leaves){
          let from = new Date(leave.from);
          let to = new Date(leave.to);
          for(let betweenDay = from;betweenDay <= to;){
            let year = betweenDay.getFullYear();
            let month = betweenDay.getMonth()+1>9?betweenDay.getMonth()+1:'0'+(betweenDay.getMonth()+1);
            let day = betweenDay.getDate()>9?betweenDay.getDate():'0'+betweenDay.getDate();
            if(year == selYear && month == selMonth){
              leavedaysPerMonth.push(year+'-'+month+'-'+day);
            }
            if(year == selYear){
              let key = monthNumbers[month];
              if(leavedaysPerMonth[key] == undefined){leavedaysPerMonth[key] = [];}
              leavedaysPerMonth[key].push(year+'-'+month+'-'+day);
            }

            betweenDay.setDate(betweenDay.getDate() + 1);
          }
        }

        let offdays = [...leavedaysPerMonth,...holidaysInMonth,...SundaysInMonth];
        offdays = [...new Set(offdays)];
        nurseDatas[nurseLevel].available += (daysInMonth-offdays.length)*8;
        nurseDatas[2].available += (daysInMonth-offdays.length)*8;

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
      
      nurseDatas.map((nurseData) =>{
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        if(nurseData.available*1 == 0){
          nurseData.utilization = 0;
        }else{
          nurseData.utilization = parseInt(nurseData.assigned*1 / nurseData.available*1 * 100);
        }
    });
      
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
    
    let pnlDatas = [],revenueDatas=[],payrollDatas=[];
    for(let month in monthNames){
      if(revenue[month] == undefined){revenue[month] = 0}
      if(payrollPerMonth[month] == undefined){payrollPerMonth[month] = 0}

      revenueDatas.push(revenue[month]);
      payrollDatas.push(payrollPerMonth[month]);
      pnlDatas.push(revenue[month]-payrollPerMonth[month]);
    }

    let days =[];
    for(let j = 0;j < 3;j++){
      for(let i = 1;i <= daysInMonth;i++){
        if(j == 0){
          days.push(i);
        }
        if(rotaHourPerDay[j][i] == undefined){rotaHourPerDay[j][i] = 0;}
        rotaHourPerDay[j][i] = parseFloat(rotaHourPerDay[j][i]/nurseDatas[j].members).toFixed(2);
      }
      for(let i = 1;i <= 12;i++){
        if(rotaHourPerMonth[j][i] == undefined){rotaHourPerMonth[j][i] = 0}
        rotaHourPerMonth[j][i] = parseFloat(rotaHourPerMonth[j][i]/nurseDatas[j].members).toFixed(2);
      }
      rotaHourPerDay[j].splice(0,1);
      rotaHourPerMonth[j].splice(0,1);
    }

    return (
      <MDBContainer>
          <MDBRow className="pt-5 mt-3 align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} max={new Date().getFullYear()+1} onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            <MDBCol md="2">
                <Form.Group>
                  <Form.Select aria-label="select" value={selMonth} onChange = {(e) =>this.onChangeMonth(e)}>
                    {
                      MonthSelect
                    }
                  </Form.Select>
                </Form.Group>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mt-3">
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://884863.smushcdn.com/2024606/wp-content/uploads/2006/10/outfit_nurse_clothes_attire_work.jpg?lossy=1&strip=1&webp=1' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBCardTitle>Members</MDBCardTitle>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].members}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].members == 0?0:(nurseDatas[0].members/nurseDatas[2].members)*100} valuemin={0} valuemax={100}>{nurseDatas[0].members}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].members == 0?0:(nurseDatas[1].members/nurseDatas[2].members)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].members}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://upload.wikimedia.org/wikipedia/commons/c/cd/180726-time-al-1252.webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBCardTitle>Available</MDBCardTitle>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].available}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].available == 0?0:(nurseDatas[0].available/nurseDatas[2].available)*100} valuemin={0} valuemax={100}>{nurseDatas[0].available}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].available == 0?0:(nurseDatas[1].available/nurseDatas[2].available)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].available}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://www.gannett-cdn.com/authoring/2019/02/08/NOKL/ghnewsok-OK-5622432-19aacf4d.jpeg?width=649&height=432&fit=crop&format=pjpg&auto=webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBCardTitle>Assigned</MDBCardTitle>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].assigned}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].assigned == 0?0:(nurseDatas[0].assigned/nurseDatas[2].assigned)*100} valuemin={0} valuemax={100}>{nurseDatas[0].assigned}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].assigned == 0?0:(nurseDatas[1].assigned/nurseDatas[2].assigned)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].assigned}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://blog.axcethr.com/hubfs/flsa-overtime-basics-for-employers%20(1).webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBCardTitle>Overtime</MDBCardTitle>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].overtime}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].overtime == 0?0:(nurseDatas[0].overtime/nurseDatas[2].overtime)*100} valuemin={0} valuemax={100}>{nurseDatas[0].overtime}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].overtime == 0?0:(nurseDatas[1].overtime/nurseDatas[2].overtime)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].overtime}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://russianvagabond.com/wp-content/uploads/2020/03/Webp.net-resizeimage-207.jpg' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBCardTitle>Utilization</MDBCardTitle>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width={nurseDatas[2].utilization} valuemin={0} valuemax={100}>
                          {nurseDatas[2].utilization+'%'}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBRow>
                      <MDBCol>
                        <MDBProgress>
                          <MDBProgressBar 
                            bgColor='success' 
                            width={nurseDatas[0].utilization} valuemin={0} valuemax={100}>{nurseDatas[0].utilization+'%'}
                          </MDBProgressBar>
                        </MDBProgress>
                      </MDBCol>
                      <MDBCol>
                        <MDBProgress>
                          <MDBProgressBar 
                            bgColor='info'
                            width={nurseDatas[1].utilization} valuemin={0} valuemax={100}>{nurseDatas[1].utilization+'%'}
                          </MDBProgressBar>
                        </MDBProgress>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          <MDBRow className='mt-2'>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='primary' width='100' valuemin={0} valuemax={100}>Total/Average</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='success' width='100' valuemin={0} valuemax={100}>Registered</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='info' width='100' valuemin={0} valuemax={100}>Assistant</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <CChart
                type="line" 
                data={{
                  labels: Mon,
                  datasets: [
                    {
                      label: "Average",
                      backgroundColor: "#00f",
                      borderColor: "#00f",
                      pointBackgroundColor: "#00f",
                      pointBorderColor: "#f00",
                      data: rotaHourPerMonth[2]
                    },
                    {
                      label: "Registered",
                      backgroundColor: "#0f0",
                      borderColor: "#0f0",
                      pointBackgroundColor: "#0f0",
                      pointBorderColor: "#f00",
                      data: rotaHourPerMonth[0]
                    },
                    {
                      label: "Assistant",
                      backgroundColor: "#0dcaf0",
                      borderColor: "#0dcaf0",
                      pointBackgroundColor: "#0dcaf0",
                      pointBorderColor: "#f00",
                      data: rotaHourPerMonth[1]
                    }
                  ],
                }}
                options={{
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.5,
                    },
                    point: {
                      radius: 3,
                      hitRadius: 10,
                      hoverRadius: 5,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </MDBCol>
            <MDBCol>
              <CChart
                type="line" 
                data={{
                  labels: Mon,
                  datasets: [
                    {
                      label: "Revenue",
                      backgroundColor: "#00f",
                      borderColor: "#00f",
                      pointBackgroundColor: "#00f",
                      pointBorderColor: "#f00",
                      data: revenueDatas
                    },
                    {
                      label: "Payroll",
                      backgroundColor: "#0f0",
                      borderColor: "#0f0",
                      pointBackgroundColor: "#0f0",
                      pointBorderColor: "#f00",
                      data: payrollDatas
                    },
                    {
                      label: "PNL",
                      backgroundColor: "#0dcaf0",
                      borderColor: "#0dcaf0",
                      pointBackgroundColor: "#0dcaf0",
                      pointBorderColor: "#f00",
                      data: pnlDatas
                    }
                  ],
                }}
                options={{
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.5,
                    },
                    point: {
                      radius: 3,
                      hitRadius: 10,
                      hoverRadius: 5,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </MDBCol>
          </MDBRow>
          <CChart
            type="line" 
            data={{
              labels: days,
              datasets: [
                {
                  label: "Average",
                  backgroundColor: "#00f",
                  borderColor: "#00f",
                  pointBackgroundColor: "#00f",
                  pointBorderColor: "#f00",
                  data: rotaHourPerDay[2]
                },
                {
                  label: "Registered",
                  backgroundColor: "#0f0",
                  borderColor: "#0f0",
                  pointBackgroundColor: "#0f0",
                  pointBorderColor: "#f00",
                  data: rotaHourPerDay[0]
                },
                {
                  label: "Assistant",
                  backgroundColor: "#0dcaf0",
                  borderColor: "#0dcaf0",
                  pointBackgroundColor: "#0dcaf0",
                  pointBorderColor: "#f00",
                  data: rotaHourPerDay[1]
                }
              ],
            }}
            options={{
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              elements: {
                line: {
                  tension: 0.5,
                },
                point: {
                  radius: 3,
                  hitRadius: 10,
                  hoverRadius: 5,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
          {/* <CWidgetStatsB
              className="mb-3"
              color="primary"
              inverse
              progress={{ color: 'white',value: 75 }}
              text="Widget helper text"
              title="Widget title"
              value="89.9%"
            /> */}

          {/* <MDBRow className='mt-2'>
            <MDBCol>
              <MDBCard background='primary' className='text-white text-center mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="basic">Registeration</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='success' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="working">Working Days</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='success' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="leave">Leave Days</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='danger' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="roaster">Duty Roaster</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-2">
            <MDBCol>
              <MDBCard background='primary' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="total">Daily Time Record</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='warning' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="payroll">Payroll</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='warning' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="revenue">Revenue</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='danger' className='text-white text-center mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="pnl">PNL</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow> */}
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,null)(DashBoard)