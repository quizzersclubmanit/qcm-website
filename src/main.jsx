import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Outlet } from 'react-router-dom'
import {Home, Auth, Quiz} from './pages/pages.js'
import { AddQuiz, ManageQuiz } from './dashboards/dashboards.js'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout/>}>
            <Route path='' element={<Home/>} />
            <Route path='signup' element={<Auth/>} />
            <Route path='login' element={<Auth label='login'/>} />
            <Route path='quiz' element={<Quiz/>} />
            <Route path='admin/' element={<Outlet/>}>
                <Route path='add' element={<AddQuiz/>} />
                <Route path='manage' element={<ManageQuiz/>} />
            </Route>
        </Route>
    )
)

const elem = document.getElementById('root')
const root = ReactDOM.createRoot(elem)
root.render(
    <RouterProvider router={router} />
)