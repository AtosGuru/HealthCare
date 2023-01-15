import React from 'react';
import './../css/App.css';
import { CWidgetStatsA } from '@coreui/react'
import { CWidgetStatsB } from '@coreui/react'
import { CWidgetStatsC } from '@coreui/react'
import { CWidgetStatsD } from '@coreui/react'
import { CWidgetStatsE } from '@coreui/react'
import { CWidgetStatsF } from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import { CRow, CCol,  CDropdown, CDropdownToggle, CDropdownMenu, 
  CDropdownItem, CLink } from '@coreui/react';
  import { CChartLine, CChartBar } from '@coreui/react-chartjs'
  import CIcon from '@coreui/icons-react'
  import {
    MDBCol,MDBContainer,MDBRow,MDBCard,MDBCardBody
  } from 'mdb-react-ui-kit';
  import {cilArrowTop, cilOptions,cibFacebook, cibTwitter,cilArrowRight, cilChartPie, } from '@coreui/icons'
import 'bootstrap/dist/css/bootstrap.min.css'

function DashBoard () {
  return (
    <MDBContainer className='pt-5'>
      <MDBRow>
  <CCol sm={3}>
    <CWidgetStatsA
      className="mb-4"
      color="primary"
      value={
        <>
          $9.000{' '}
          <span className="fs-6 fw-normal">
            (40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title="Widget title"
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartLine
          className="mt-3 mx-3"
          style={{ height: '70px' }}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: '#321fdb',
                data: [65, 59, 84, 84, 51, 55, 40],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                min: 30,
                max: 89,
                display: false,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 1,
                tension: 0.4,
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }}
        />
      }
    />
  </CCol>
  <CCol sm={3}>
    <CWidgetStatsA
      className="mb-4"
      color="info"
      value={
        <>
          $9.000{' '}
          <span className="fs-6 fw-normal">
            (40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title="Widget title"
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartLine
          className="mt-3 mx-3"
          style={{ height: '70px' }}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,.55)',
                pointBackgroundColor: '#39f',
                data: [1, 18, 9, 17, 34, 22, 11],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                min: -9,
                max: 39,
                display: false,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 1,
              },
              point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }}
        />
      }
    />
  </CCol>
  <CCol sm={3}>
    <CWidgetStatsA
      className="mb-4"
      color="warning"
      value={
        <>
          $9.000{' '}
          <span className="fs-6 fw-normal">
            (40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title="Widget title"
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartLine
          className="mt-3"
          style={{ height: '70px' }}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [78, 81, 80, 45, 34, 12, 40],
                fill: true,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            elements: {
              line: {
                borderWidth: 2,
                tension: 0.4,
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }}
        />
      }
    />
  </CCol>
  <CCol sm={3}>
    <CWidgetStatsA
      className="mb-4"
      color="danger"
      value={
        <>
          $9.000{' '}
          <span className="fs-6 fw-normal">
            (40.9% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title="Widget title"
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      chart={
        <CChartBar
          className="mt-3 mx-3"
          style={{ height: '70px' }}
          data={{
            labels: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
              'January',
              'February',
              'March',
              'April',
            ],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                barPercentage: 0.6,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                  drawBorder: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
      }
    />
  </CCol>
  </MDBRow>  
<CRow>
  <CCol xs={6}>
    <CWidgetStatsB
      className="mb-3"
      color="primary"
      inverse
      progress={{ value: 75 }}
      text="Widget helper text"
      title="Widget title"
      value="89.9%"
    />
  </CCol>
  <CCol xs={6}>
    <CWidgetStatsB
      className="mb-3"
      color="warning"
      inverse
      progress={{ value: 75 }}
      text="Widget helper text"
      title="Widget title"
      value="89.9%"
    />
  </CCol>
</CRow>
<CRow>
  <CCol xs={6}>
    <CWidgetStatsC
      className="mb-3"
      icon={<CIcon icon={cilChartPie} height={36} />}
      color="warning"
      inverse
      progress={{ color: 'success', value: 75 }}
      text="Widget helper text"
      title="Widget title"
      value="89.9%"
    />
  </CCol>
  <CCol xs={6}>
    <CWidgetStatsC
      className="mb-3"
      icon={<CIcon icon={cilChartPie} height={36} />}
      color="primary"
      inverse
      progress={{ value: 75 }}
      text="Widget helper text"
      title="Widget title"
      value="89.9%"
    />
  </CCol>
</CRow> 
<CRow>
  <CCol xs={6}>
    <CWidgetStatsD
      className="mb-3"
      icon={<CIcon className="my-4 text-white" icon={cibFacebook} height={52} />}
      chart={
        <CChartLine
          className="position-absolute w-100 h-100"
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                backgroundColor: '#4682B4',
                borderColor: '#CCCCFF',
                pointHoverBackgroundColor: '#D4F1F4',
                borderWidth: 2,
                data: [65, 59, 84, 84, 51, 55, 40],
                fill: true,
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
              },
            },
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      }
      style={{ '--cui-card-cap-bg': '#3b5998' }}
      values={[
        { title: 'friends', value: '89K' },
        { title: 'feeds', value: '459' },
      ]}
    />
  </CCol>
  <CCol xs={6}>
    <CWidgetStatsD
      className="mb-3"
      icon={<CIcon className="my-4 text-white" icon={cibTwitter} height={52} />}
      chart={
        <CChartLine
          className="position-absolute w-100 h-100"
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                backgroundColor: 'rgba(255,255,255,.1)',
                borderColor: 'rgba(255,255,255,.55)',
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: [1, 13, 9, 17, 34, 41, 38],
                fill: true,
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
              },
            },
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      }
      style={{ '--cui-card-cap-bg': '#00aced' }}
      values={[
        { title: 'folowers', value: '973K' },
        { title: 'tweets', value: '1.792' },
      ]}
    />
  </CCol>
</CRow>
<CRow>
  <CCol xs={6}>
    <CWidgetStatsE
      className="mb-3"
      chart={
        <CChartBar
          className="mx-auto"
          style={{ height: '40px', width: '80px' }}
          data={{
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
            datasets: [
              {
                backgroundColor: '#321fdb',
                borderColor: 'transparent',
                borderWidth: 1,
                data: [41, 78, 51, 66, 74, 42, 89, 97, 87, 84, 78, 88, 67, 45, 47],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      }
      title="Widget title"
      value="89.9%"
    />
  </CCol>
  <CCol xs={6}>
    <CWidgetStatsE
      className="mb-3"
      chart={
        <CChartLine
          className="mx-auto"
          style={{ height: '40px', width: '80px' }}
          data={{
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
            datasets: [
              {
                backgroundColor: 'transparent',
                borderColor: '#321fdb',
                borderWidth: 2,
                data: [41, 78, 51, 66, 74, 42, 89, 97, 87, 84, 78, 88, 67, 45, 47],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 0,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      }
      title="Widget title"
      value="89.9%"
    />
  </CCol>
</CRow>
<CRow>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="primary"
        icon={<CIcon icon={cilChartPie} height={24} />}
        title="Widget title"
        value="89.9%"/>
    </CCol>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="warning"
        icon={<CIcon icon={cilChartPie} height={24} />}
        title="Widget title"
        value="89.9%"/>
    </CCol>
  </CRow>
  <CRow>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="primary"
        icon={<CIcon icon={cilChartPie} height={24} />}
        padding={false}
        title="Widget title"
        value="89.9%"/>
    </CCol>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="warning"
        icon={<CIcon icon={cilChartPie} height={24} />}
        padding={false}
        title="Widget title"
        value="89.9%"/>
    </CCol>
  </CRow>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="primary"
        footer={
          <CLink
            className="font-weight-bold font-xs text-medium-emphasis"
            href="https://coreui.io/"
            rel="noopener norefferer"
            target="_blank"
          >
            View more
            <CIcon icon={cilArrowRight} className="float-end" width={16} />
          </CLink>
        }
        icon={<CIcon icon={cilChartPie} height={24} />}
        title="Widget title"
        value="89.9%"/>
    </CCol>
    <CCol xs={6}>
      <CWidgetStatsF
        className="mb-3"
        color="warning"
        footer={
          <CLink
            className="font-weight-bold font-xs text-medium-emphasis"
            href="https://coreui.io/"
            rel="noopener norefferer"
            target="_blank"
          >
            View more
            <CIcon icon={cilArrowRight} className="float-end" width={16} />
          </CLink>
        }
        icon={<CIcon icon={cilChartPie} height={24} />}
        title="Widget title"
        value="89.9%"/>
    </CCol>
  </MDBContainer>
  );
}
export default DashBoard;