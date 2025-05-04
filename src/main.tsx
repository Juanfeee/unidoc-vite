import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Registro from './auth/register.tsx'
import Login from './auth/login.tsx'
import InformacionPersona from './protected/datos-personales/page.tsx'
import ProtectedLayout from './layouts/ProtectedLayout.tsx'
import ProtectedRoute from './componentes/ProtectedRoute.tsx'
import Index from './protected/index/page.tsx'
import AgregarEstudio from './protected/agregar/estudio.tsx'
import AgregarExperiencia from './protected/agregar/experiencia.tsx'
import AgregarIdioma from './protected/agregar/idioma.tsx'
import PreEstudio from './protected/editar/estudio/pre-estudio.tsx'
import EditarEstudio from './protected/editar/estudio/EditarEstudio.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="inicio-sesion" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        {/* Rutas protegidas con layout */}
        <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
          <Route path="datos-personales" element={<InformacionPersona />} />
          <Route path='index' element={<Index />} />
          <Route path='/agregar/estudio' element={<AgregarEstudio/>} />
          <Route path='/agregar/experiencia' element={<AgregarExperiencia/>} />
          <Route path='/agregar/idioma' element={<AgregarIdioma/>} />
          <Route path='/ver/estudios' element={<PreEstudio/>} />
          <Route path="/editar/estudio/:id" element={<EditarEstudio />} />
        </Route>

        <Route path="*" element={<h1 className='text-white text-6xl font-bold'>No found</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
