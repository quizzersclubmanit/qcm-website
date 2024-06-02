import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import {Home, Auth, Admin, Quiz} from './pages/pages.js'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout/>}>
            <Route path='' element={<Home/>} />
            <Route path='signup' element={<Auth/>} />
            <Route path='login' element={<Auth label='login'/>} />
            <Route path='quiz' element={<Quiz/>} />
            <Route path='admin' element={<Admin/>} />
        </Route>
    )
)

const elem = document.getElementById('root')
const root = ReactDOM.createRoot(elem)
root.render(
    <RouterProvider router={router} />
)