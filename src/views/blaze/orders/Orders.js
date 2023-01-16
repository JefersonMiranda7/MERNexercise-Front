import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CAlert,
  CNav,
  CNavLink
} from '@coreui/react';

const Orders = () => {
  const [arrOrders, setArrOrders] = useState([]); //array of orders from db
  const [visibleAdd, setVisibleAdd] = useState(false) //modalAdd
  const [visibleDelete, setVisibleDelete] = useState(false) //modalDelete
  const [flagSuccessAdd, setFlagSuccessAdd] = useState(false)
  const [flagSuccessDelete, setFlagSuccessDelete] = useState(false)
  const [newOrder, setNewOrder] = useState({ //for edit mode as well
    customer: '',
    date: '',
    status: 'Pending'
  })
  const navigate = useNavigate();
  const url = 'http://localhost:5000/orders/';

  const handleChange = (e) => {
    const {name, value} = e.target
    if (name === 'date') setNewOrder({ ...newOrder, [name]: changeFormat(value) })
    else setNewOrder({ ...newOrder, [name]: value })
  }

  const changeFormat = (date) => {
    return date.substring(8,10) + '/' + date.substring(5,7) + '/' + date.substring(0,4)
  }

  const pGet = async () => {
    await axios.get(url)
    .then (response => {
      setArrOrders(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPost = async () => {
    await axios.post(url, newOrder) //url and body
    .then (response => {
      setVisibleAdd(false)
      setFlagSuccessAdd(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pDelete = async () => {
    await axios.delete(url + newOrder.idOrder)
    .then (response => {
      setVisibleDelete(false)
      setFlagSuccessDelete(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const onSelectedOrder = (order, action) => {
    setNewOrder(order)
    if (action === 'Edit') {
      localStorage.setItem('idOrder', order.idOrder)
      navigate(`/orders/${order.idOrder}`)
    }
    else setVisibleDelete(true)
  }
  
  useEffect ( () => {
    pGet();
  }, [])
  
  useEffect ( () => { 
    pGet();
  }, [visibleDelete])

  useEffect ( () => { 
    pGet();
  }, [visibleAdd])

  return (
    <CRow>
      <CCol>
        <CCard className='mb-3'>
          <CCardBody>
            <CNav component="nav" variant="pills" className="flex-column flex-sm-row">
              <CNavLink href="#/orders" active>
                Orders
              </CNavLink>
              <CNavLink href="#/products">
                Products
              </CNavLink>
            </CNav>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <p style={{fontSize: 25}}>
              Orders
            </p>
            <CCol className='mb-3' style={{display:'flex', justifyContent:'right'}}>
              <CButton color={'primary'} shape="rounded-pill" onClick={() => setVisibleAdd(true)}>
                Create Order
              </CButton>
            </CCol>
            { arrOrders.length !== 0 ? 
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">N°</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  { arrOrders.map (order => (
                    <CTableRow key={order.idOrder}>
                      <CTableDataCell>{order.idOrder}</CTableDataCell>
                      <CTableDataCell>{order.customer}</CTableDataCell>
                      <CTableDataCell>{order.status}</CTableDataCell>
                      <CTableDataCell>{order.date}</CTableDataCell>
                      <CTableDataCell>$ {order.totalAmount}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color={'secondary'} shape="rounded-pill" onClick={() => onSelectedOrder(order, 'Edit')}>
                          {order.status === 'Pending' ? 'Edit' : 'View'}
                        </CButton>
                        {' '}
                        <CButton color={'danger'} shape="rounded-pill" onClick={() => onSelectedOrder(order, 'Delete')}>
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable> : 
              <CCol sm='12'>
                <CAlert color="info" dismissible> There are not created orders.</CAlert>
              </CCol>}
            
            {/* Add Modal */}
            <CModal alignment="center" visible={visibleAdd} onClose={() => setVisibleAdd(false)}>
              <CModalHeader>
                <CModalTitle>Add Order</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormFloating className="mb-3">
                  <CFormInput type="customer" id="floatingCustomer" name='customer' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingCustomer">Customer</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="date" id="floatingDate" name='date' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingDate">Date</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput disabled type="status" id="floatingStatus" name='status' value='Pending' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingStatus">Status</CFormLabel>
                </CFormFloating>
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={() => pPost()}>
                  Confirm
                </CButton>
                <CButton color="secondary" onClick={() => setVisibleAdd(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            { flagSuccessAdd && 
              <CCol sm='12'>
                <CAlert color="success" dismissible>Order has been added successfully!</CAlert>
              </CCol>}
            
            {/* Delete modal */}
            <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
              <CModalHeader>
                <CModalTitle>Delete Order</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Are you sure?
              </CModalBody>
              <CModalFooter>
                <CButton color="danger" onClick={() => pDelete()}>
                  Confirm
                </CButton>
                <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            { flagSuccessDelete && 
              <CCol sm='12'>
                <CAlert color="success" dismissible>Order has been deleted successfully!</CAlert>
              </CCol>}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Orders