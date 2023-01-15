import React,{ Suspense } from 'react'
import { Route, Routes,Navigate } from 'react-router-dom';

import { Navbar,Sidebar } from '../components/index'
import routes from '../routes'

import {MDBContainer,MDBRow,MDBCol,MDBBtn,MDBBtnGroup} from 'mdb-react-ui-kit'

const Layout = () => {
  return (
    <MDBRow>
        <Sidebar />
      <div className="main">
        <Navbar />
        <Suspense>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </div>
    </MDBRow>
  )
}

export default Layout
