import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpa,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'BLAZE',
  },
  {
    component: CNavItem,
    name: 'Blaze',
    to: '/orders',
    icon: <CIcon icon={cilSpa} customClassName="nav-icon" />,
  }
]

export default _nav
