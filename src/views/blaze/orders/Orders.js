import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
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
  const [arrProducts, setArrProducts] = useState([]); //data
  const [visible, setVisible] = useState(false) //modalInsertar
  const [visibleEditar, setVisibleEditar] = useState(false) //modalEditar
  const [visibleEliminar, setVisibleEliminar] = useState(false) //modalEditar
  const [exito, setExito] = useState(false)
  const [exitoEditar, setExitoEditar] = useState(false)
  const [exitoEliminar, setExitoEliminar] = useState(false)
  const [newProduct, setNewProduct] = useState({ //gestorSeleccionado
    name: '',
    category: '',
    unitPrice: 0.0,
    active: ''
  })
  const url = 'http://localhost:5000/products/';
  
  useEffect ( () => {
    pGet();
  }, [])

  const getProducts = async () => {
    const res = await axios.get(url);
    setArrProducts(res.data);
  }

  const deleteProducts = async (id) => {
    // axios.delete(`${url}${id}`);
    getProducts();
  }

  //
  //Cambio en el input
  const handleChange = (e) => {
    const {name, value} = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  //Peticiones
  const pGet = async () => {
    await axios.get(url)
    .then (response => {
      console.log(response.data)
      setArrProducts(response.data)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPost = async () => {
    delete newProduct.idProduct; //Lo genera la bd
    newProduct.unitPrice = parseFloat(newProduct.unitPrice)
    await axios.post(url, newProduct) //Url y body
    .then (response => {
      setArrProducts(arrProducts.concat(response.data))
      setVisible(false)
      setExito(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pPut = async () => {
    newProduct.unitPrice = parseFloat(newProduct.unitPrice)
    await axios.put(url + '/' + newProduct.id, newProduct) //Url y body
    .then (response => {
      // var respuesta = response.data
      // var dataAuxiliar = arrProducts
      
      // dataAuxiliar.map(product => {
      //   if (product.id === newProduct.id){
      //     product.name = respuesta.name
      //     product.category = respuesta.category
      //     product.unitPrice = respuesta.unitPrice
      //     product.active = respuesta.active
      //   }
      // })
      // setVisibleEditar(false)
      // setExitoEditar(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const pDelete = async () => {
    await axios.delete(url + '/' + newProduct.id)
    .then (response => {
      setArrProducts(arrProducts.filter(product => product.id !== response.data))
      setVisibleEliminar(false)
      setExitoEliminar(true)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const onAddProduct = () => {
    setVisible(true)
  }
  
  const onSelectedProduct = (product, action) => {
    setNewProduct(product)
    if (action === 'Edit') setVisibleEditar(true)
    else setVisibleEliminar(true)
  }

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
          <CCardHeader>
            <strong>Orders</strong>
          </CCardHeader>
          <CCardBody>
            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products