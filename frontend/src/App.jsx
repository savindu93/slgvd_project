import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import ResultsPage from './pages/ResultsPage'
import VariantPage from './pages/VariantPage'
import DSPortalPage from "./pages/DSPortalPage";
import DSLoginPage from "./pages/DSLoginPage";
import Documentation from "./pages/Documentation";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        <Route exact path = '/' element = {<Home />} />
        <Route path = '/results' element = {<ResultsPage />} />
        <Route path='/:variation_id' element = {<VariantPage />}/>
        <Route path='/submit-data' element = {
          <ProtectedRoute>
            <DSPortalPage />
          </ProtectedRoute>
          
          }
         />
        <Route path='/login' element = {<DSLoginPage />} />
        <Route path='/documentation' element = {<Documentation />}/>

      </Routes>

    </BrowserRouter>
  )
}

export default App

