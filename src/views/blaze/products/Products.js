import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';
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

const Products = () => {
  const [arrProducts, setArrProducts] = useState([]); //array of products from db
  const [visibleAdd, setVisibleAdd] = useState(false) //modalAdd
  const [visibleEdit, setVisibleEdit] = useState(false) //modalEdit
  const [visibleDelete, setVisibleDelete] = useState(false) //modalDelete
  const [flagSuccessAdd, setFlagSuccessAdd] = useState(false)
  const [flagSuccessEdit, setFlagSuccessEdit] = useState(false)
  const [flagSuccessDelete, setFlagSuccessDelete] = useState(false)
  const [newProduct, setNewProduct] = useState({ //gestorSeleccionado
    idProduct: 0,
    name: '',
    category: '',
    unitPrice: 0.0,
    active: 1
  })
  const url = 'http://localhost:5000/products/';

  //Cambio en el input
  const handleChange = (e) => {
    const {name, value} = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  //Peticiones
  const pGet = async () => {
    await axios.get(url)
    .then (response => {
      setArrProducts(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPost = async () => {
    newProduct.unitPrice = parseFloat(newProduct.unitPrice)
    await axios.post(url, newProduct) //url and body
    .then (response => {
      setVisibleAdd(false)
      setFlagSuccessAdd(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPut = async () => {
    newProduct.unitPrice = parseFloat(newProduct.unitPrice)
    await axios.put(url + newProduct.idProduct, newProduct) //url and body
    .then (response => {
      setVisibleEdit(false)
      setFlagSuccessEdit(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pDelete = async () => {
    await axios.delete(url + newProduct.idProduct)
    .then (response => {
      setVisibleDelete(false)
      setFlagSuccessDelete(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const onSelectedProduct = (product, action) => {
    setNewProduct(product)
    if (action === 'Edit') setVisibleEdit(true)
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
              <CNavLink href="#/products" active>
                Products
              </CNavLink>
            </CNav>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <p style={{fontSize: 25}}>
              Products
            </p>
            <CCol className='mb-2' style={{display:'flex', justifyContent:'right'}}>
              <CButton color={'primary'} onClick={() => setVisibleAdd(true)}>
                Create Product
              </CButton>
            </CCol>
            
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">N°</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                { arrProducts.map (product => (
                  <CTableRow key={product.idProduct}>
                    <CTableDataCell>{product.idProduct}</CTableDataCell>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.category}</CTableDataCell>
                    <CTableDataCell>$ {product.unitPrice}</CTableDataCell>
                    <CTableDataCell>{product.active ? 'Active' : 'Inactive'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color={'secondary'} onClick={() => onSelectedProduct(product, 'Edit')}>
                        Edit
                      </CButton>
                      {' '}
                      <CButton color={'danger'} onClick={() => onSelectedProduct(product, 'Delete')}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            
            {/* Add Modal */}
            <CModal alignment="center" visible={visibleAdd} onClose={() => setVisibleAdd(false)}>
              <CModalHeader>
                <CModalTitle>Add Product</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormFloating className="mb-3">
                  <CFormInput type="name" id="floatingName" name='name' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingName">Name</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="category" id="floatingCategory" name='category' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingCategory">Category</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="unitPrice" id="floatingUnitPrice" name='unitPrice' onChange={handleChange}/>
                  <CFormLabel htmlFor="floatingUnitPrice">Unit Price</CFormLabel>
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
                <CAlert color="success" dismissible>Product has been added successfully!</CAlert>
              </CCol>}
            
            {/* Edit modal */}
            <CModal alignment="center" visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
              <CModalHeader>
                <CModalTitle>Edit Product</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormFloating className="mb-3">
                  <CFormInput type="name" id="floatingName" name='name' onChange={handleChange} value={newProduct.name}/>
                  <CFormLabel htmlFor="floatingName">Name</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="category" id="floatingCategory" name='category' onChange={handleChange} value={newProduct.category}/>
                  <CFormLabel htmlFor="floatingCategory">Category</CFormLabel>
                </CFormFloating>
                <CFormFloating className="mb-3">
                  <CFormInput type="unitPrice" id="floatingUnitPrice" name='unitPrice' onChange={handleChange} value={newProduct.unitPrice}/>
                  <CFormLabel htmlFor="floatingUnitPrice">Unit Price</CFormLabel>
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
                <CAlert  color="success" dismissible>Product has been edited successfully!</CAlert>
              </CCol>}

              {/* Delete modal */}
            <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
              <CModalHeader>
                <CModalTitle>Delete Product</CModalTitle>
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
                <CAlert  color="success" dismissible>Product has been deleted successfully!</CAlert>
              </CCol>}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products