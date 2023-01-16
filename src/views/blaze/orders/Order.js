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
  CNavLink,
  CFormSelect
} from '@coreui/react';

const Order = () => {
  const [arrOrderItems, setArrOrderItems] = useState([]); //array of order items from db
  const [arrProducts, setArrProducts] = useState([]); //array of products items from db
  const [visibleAdd, setVisibleAdd] = useState(false) //modalAdd
  const [visibleEdit, setVisibleEdit] = useState(false) //modalEdit
  const [visibleEditOrder, setVisibleEditOrder] = useState(false) //modalEditOrder: complete or reject
  const [visibleDelete, setVisibleDelete] = useState(false) //modalDelete
  const [flagSuccessAdd, setFlagSuccessAdd] = useState(false)
  const [flagSuccessEdit, setFlagSuccessEdit] = useState(false)
  const [flagSuccessEditOrder, setFlagSuccessEditOrder] = useState(false) //flag for complete or reject
  const [flagSuccessDelete, setFlagSuccessDelete] = useState(false)
  const [actionOverOrder, setActionOverOrder] = useState('')
  const actionMessage = actionOverOrder === 'Completed' ? 'completed' : 'rejected'
  const navigate = useNavigate();
  const idOrderSelected = localStorage.getItem('idOrder');
  const [orderSelected, setOrderSelected] = useState({});
  const [productSelected, setProductSelected] = useState('');
  const [newOrderItem, setNewOrderItem] = useState({ //for each product in order
    idProduct: 0,
    idOrder: parseInt(idOrderSelected),
    quantity: 0
  })
  const [newOrder, setNewOrder] = useState({
    status: '',
    number: idOrderSelected.toString()
  })
  const url = `http://localhost:5000/orderItems/`;

  const handleChange = (e) => {
    const {name, value} = e.target
    setNewOrderItem({ ...newOrderItem, [name]: parseInt(value) })
  }

  const pGet = async () => {
    await axios.get(url + idOrderSelected)
    .then (response => {
      setArrOrderItems(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPost = async () => {
    await axios.post(url, newOrderItem) //url and body
    .then (response => {
      setVisibleAdd(false)
      setFlagSuccessAdd(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPut = async () => {
    await axios.put(url + newOrderItem.idOrderItem, newOrderItem) //url and body
    .then (response => {
      setVisibleEdit(false)
      setFlagSuccessEdit(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pDelete = async () => {
    await axios.delete(url + newOrderItem.idOrderItem)
    .then (response => {
      setVisibleDelete(false)
      setFlagSuccessDelete(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const onSelectedOrderItem = (orderItem, action) => {
    setNewOrderItem(orderItem)
    if (action === 'Edit') setVisibleEdit(true)
    else setVisibleDelete(true)
    setProductSelected(orderItem.product)
  }

  const changeOrderStatus = (newStatus) => {
    setVisibleEditOrder(true)
    setNewOrder({ ...newOrder, 'status': newStatus })
    setActionOverOrder(newStatus)
  }
  
  const pGetOrder = async () => {
    await axios.get('http://localhost:5000/orders/' + idOrderSelected)
    .then (response => {
      setOrderSelected(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }
  
  const pPutOrder = async () => {
    await axios.put('http://localhost:5000/orders/' + idOrderSelected, newOrder) //url and body
    .then (response => {
      setVisibleEditOrder(false)
      setFlagSuccessEditOrder(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pGetProducts = async () => {
    await axios.get('http://localhost:5000/products/')
    .then (response => {
      setArrProducts(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }

  useEffect ( () => {
    pGet();
    pGetOrder();
    pGetProducts();
  }, [])
  
  useEffect ( () => {
    pGetOrder();
  }, [visibleEditOrder])
  
  useEffect ( () => { 
    pGet();
  }, [visibleDelete])

  useEffect ( () => { 
    pGet();
  }, [visibleEdit])

  useEffect ( () => { 
    pGet();
  }, [visibleAdd])

  return (
    <CRow>
      <CCol>
        <CCard className='mb-3'>
          <CCardBody>
            <CNav component="nav" variant="pills" className="flex-column flex-sm-row">
              <CNavLink href="#/orders">
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
            <CCol className='mb-2' style={{display:'flex', justifyContent:'right'}}>
              <CButton color={'secondary'} shape="rounded-pill" onClick={() => navigate(`/orders/`)}>
                Back
              </CButton>
            </CCol>
            <p style={{fontSize: 25}}>
              Order N° {idOrderSelected}
            </p>
            <CCol sm={3}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden'}} type="customer" id="floatingCustomer" name='customer' value={orderSelected.customer}/>
                <CFormLabel htmlFor="floatingCustomer">Customer</CFormLabel>
              </CFormFloating>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{ border: 'hidden'}} type="status" id="floatingStatus" name='status' value={orderSelected.status}/>
                <CFormLabel htmlFor="floatingStatus">Status</CFormLabel>
              </CFormFloating>
              <CFormFloating className="mb-3">
                <CFormInput readOnly style={{border: 'hidden'}} id="floatingDate" name='date' value={orderSelected.date}/>
                <CFormLabel htmlFor="floatingDate">Date</CFormLabel>
              </CFormFloating>
            </CCol>
            { arrOrderItems.length !== 0 ? 
              <CTable className='mb-2' striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">N°</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Unit Price</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost</CTableHeaderCell>
                    { orderSelected.status === 'Pending' && <CTableHeaderCell scope="col">Actions</CTableHeaderCell> }
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  { arrOrderItems.map (orderItem => (
                    <CTableRow key={orderItem.idOrderItem}>
                      <CTableDataCell>{orderItem.idOrderItem}</CTableDataCell>
                      <CTableDataCell>{orderItem.product.name}</CTableDataCell>
                      <CTableDataCell>{orderItem.quantity}</CTableDataCell>
                      <CTableDataCell>$ {orderItem.product.unitPrice}</CTableDataCell>
                      <CTableDataCell>$ {parseFloat(orderItem.quantity * orderItem.product.unitPrice).toFixed(2)}</CTableDataCell>
                      { orderSelected.status === 'Pending' && 
                        <CTableDataCell>
                          <CButton color={'secondary'} shape="rounded-pill" onClick={() => onSelectedOrderItem(orderItem, 'Edit')}>
                            Edit
                          </CButton>
                          {' '}
                          <CButton color={'danger'} shape="rounded-pill" onClick={() => onSelectedOrderItem(orderItem, 'Delete')}>
                            Delete
                          </CButton>
                        </CTableDataCell>
                      }
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable> : 
              <CCol sm='12'>
                <CAlert color="info" dismissible> There are not created order items.</CAlert>
              </CCol>}
            { orderSelected.status === 'Pending' && 
              <CCol className='mb-3' style={{display:'flex', justifyContent:'right'}}>
                <CButton color={'primary'} shape="rounded-pill" onClick={() => setVisibleAdd(true)}>
                  Add item +
                </CButton>
              </CCol>
            }
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right', fontWeight: 'bold'}} id="floatingSubtotal" name='subtotal' value={orderSelected.subtotal}/>
                <CFormLabel style={{fontSize: 20, fontWeight: 'bold'}} htmlFor="floatingSubtotal">Subtotal</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right', fontWeight: 'bold'}} id="floatingTotalTaxes" name='totalTaxes' value={orderSelected.totalTaxes}/>
                <CFormLabel style={{fontSize: 20, fontWeight: 'bold'}} htmlFor="floatingTotalTaxes">Total Taxes</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right'}} type="cityTax" id="floatingCityTax" name='cityTax' value={orderSelected.cityTax}/>
                <CFormLabel style={{fontSize: 17}} htmlFor="floatingCityTax">Total City Tax</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right'}} type="countryTax" id="floatingCountryTax" name='countryTax' value={orderSelected.countryTax}/>
                <CFormLabel style={{fontSize: 17}} htmlFor="floatingCountryTax">Total Country Tax</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right'}} type="stateTax" id="floatingStateTax" name='stateTax' value={orderSelected.stateTax}/>
                <CFormLabel style={{fontSize: 17}} htmlFor="floatingStateTax">Total State Tax</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-1">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right'}} type="federalTax" id="floatingFederalTax" name='federalTax' value={orderSelected.federalTax}/>
                <CFormLabel style={{fontSize: 17}} htmlFor="floatingFederalTax">Total Federal Tax</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol sm={12} style={{display:'flex', justifyContent:'right'}}>
              <CFormFloating className="mb-3">
                <CFormInput readOnly style={{border: 'hidden', textAlign: 'right', fontWeight: 'bold'}} id="floatingTotalAmount" name='totalAmount' value={orderSelected.totalAmount}/>
                <CFormLabel style={{fontSize: 20, fontWeight: 'bold'}} htmlFor="floatingTotalAmount">Total</CFormLabel>
              </CFormFloating>
            </CCol>
            { orderSelected.status === 'Pending' && 
              <CCol className='mb-2' style={{display:'flex', justifyContent:'right'}}>
                <CButton style={{marginRight: 10}} color="success" shape="rounded-pill" onClick={() => changeOrderStatus('Completed')}>
                  Complete Order
                </CButton>
                <div>{ }</div>
                <CButton color="danger" shape="rounded-pill" onClick={() => changeOrderStatus('Rejected')}>
                  Reject Order
                </CButton>
              </CCol>
            }
            
            {/* Complete/reject modal */}
            <CModal alignment="center" visible={visibleEditOrder} onClose={() => setVisibleEditOrder(false)}>
              <CModalHeader>
                <CModalTitle>Change Status</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Do yo want to {actionOverOrder} this order?
              </CModalBody>
              <CModalFooter>
                <CButton color={actionOverOrder === 'Completed' ? 'success' : 'danger'} onClick={() => pPutOrder()}>
                  Confirm
                </CButton>
                <CButton color='secondary' onClick={() => setVisibleEditOrder(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            { flagSuccessEditOrder && 
              <CCol sm='12'>
                <CAlert color="success" dismissible>Order has been {actionMessage} successfully!</CAlert>
              </CCol>}

            {/* Add Modal */}
            <CModal alignment="center" visible={visibleAdd} onClose={() => setVisibleAdd(false)}>
              <CModalHeader>
                <CModalTitle>Add Order Item</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormFloating className="mb-3">
                  <CFormSelect type="idProduct" id="floatingProduct" name='idProduct' onChange={handleChange}>
                    <option key={0} value={0}>Choose a product</option>
                  { arrProducts.map (product => ( <option key={product.idProduct} value={product.idProduct}>{product.name}</option>))}
                </CFormSelect>
                  <CFormLabel style={{ fontSize: 12}} htmlFor="floatingCustomer">Product</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="quantity" id="floatingQuantity" name='quantity' onChange={handleChange}/>
                  <CFormLabel style={{ fontSize: 12}} htmlFor="floatingQuantity">Quantity</CFormLabel>
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
                <CAlert color="success" dismissible>Order item has been added successfully!</CAlert>
              </CCol>}
            
            {/* Edit modal */}
            <CModal alignment="center" visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
              <CModalHeader>
                <CModalTitle>Edit Order Item N° {newOrderItem.idOrderItem}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormFloating className="mb-3">
                  <CFormInput readOnly style={{border: 'hidden'}} type="product" id="floatingProduct" name='product' onChange={handleChange} value={productSelected.name}/>
                  <CFormLabel htmlFor="floatingProduct">Product</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="quantity" id="floatingQuantity" name='quantity' onChange={handleChange} value={newOrderItem.quantity}/>
                  <CFormLabel htmlFor="floatingQuantity">Quantity</CFormLabel>
                </CFormFloating>
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={() => pPut()}>
                  Confirm
                </CButton>
                <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            { flagSuccessEdit && 
              <CCol sm='12'>
                <CAlert color="success" dismissible>Order item has been edited successfully!</CAlert>
              </CCol>}

            {/* Delete modal */}
            <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
              <CModalHeader>
                <CModalTitle>Delete Order Item</CModalTitle>
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
                <CAlert color="success" dismissible>Order item has been deleted successfully!</CAlert>
              </CCol>}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Order