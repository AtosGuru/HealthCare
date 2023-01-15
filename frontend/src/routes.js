import React from 'react'

const DashBoard = React.lazy(() => import('./pages/dashboard'))
const Basic = React.lazy(() => import('./pages/basic'))
const WorkingDays = React.lazy(() => import('./pages/working'))
const LeaveDays = React.lazy(() => import('./pages/leave'))
const Roaster = React.lazy(() => import('./pages/roaster'))
const DTR = React.lazy(() => import('./pages/dtr'))
const PayRoll = React.lazy(() => import('./pages/payroll'))
const Revenue = React.lazy(() => import('./pages/revenue'))
const PNL = React.lazy(() => import('./pages/pnl'))
const FTE = React.lazy(() => import('./pages/fte'))
const NotFound = React.lazy(() => import('./pages/404page'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: DashBoard },
  { path: '/basic', name: 'Basic', element: Basic },
  { path: '/working', name: 'WorkingDays', element: WorkingDays },
  { path: '/leave', name: 'LeaveDays', element: LeaveDays },
  { path: '/roaster', name: 'Roaster', element: Roaster },
  { path: '/dtr', name: 'DTR', element: DTR },
  { path: '/payroll', name: 'PayRoll', element: PayRoll },
  { path: '/revenue', name: 'Revenue', element: Revenue },
  { path: '/pnl', name: 'PNL', element: PNL },
  { path: '/fte', name: 'FTE', element: FTE },
  { path: '*', name: 'NotFound', element: NotFound },
]

export default routes
