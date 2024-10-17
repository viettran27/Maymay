import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import { routes } from './constants/routes'
import BaoCao from '@/pages/Baocao'
import { Navigate } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={'/baocao'}/>} />
        <Route path="/baocao" element={<BaoCao />} />
        <Route path="/" element={<App />} >
          {
            routes.map((route, index) => (
              route.component && <Route
                key={index}
                path={route.path}
                element={route.component}
              />
            ))
          }
        </Route>
      </Routes>
    </BrowserRouter>
  // </StrictMode>,
)
