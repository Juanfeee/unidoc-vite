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
import AgregarEstudio from './protected/agregar/AgregarEstudio.tsx'
import AgregarExperiencia from './protected/agregar/AgregarExperiencia.tsx'
import AgregarIdioma from './protected/agregar/AgregarIdioma.tsx'
import PreEstudio from './protected/editar/estudio/pre-estudio.tsx'
import EditarEstudio from './protected/editar/estudio/EditarEstudio.tsx'
import Configuracion from './protected/configuracion/configuracion.tsx'
import PreIdioma from './protected/editar/idioma/pre-idioma.tsx'
import EditarIdioma from './protected/editar/idioma/EditarIdioma.tsx'
import EditarExperiencia from './protected/editar/experiencia/EditarExperiencia.tsx'
import PreExperiencia from './protected/editar/experiencia/pre-experiencia.tsx'
import AgregarAptitudes from './protected/agregar/AgregarAptitudes.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas con App como layout principal */}
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="inicio-sesion" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
          <Route path="index" element={<Index />} />
          <Route path="datos-personales" element={<InformacionPersona />} />
          <Route path="configuracion" element={< Configuracion />} />
          <Route path="agregar">
            <Route index element={<span>No found</span>} />
            <Route path="estudio" element={<AgregarEstudio />} />
            <Route path="experiencia" element={<AgregarExperiencia />} />
            <Route path="idioma" element={<AgregarIdioma />} />
            <Route path="aptitudes" element={<AgregarAptitudes/>} />
          </Route>

          <Route path="editar">
            <Route path="estudios" element={<PreEstudio />} />
            <Route path="estudio/:id" element={<EditarEstudio />} />
            <Route path="idiomas" element={<PreIdioma />} />
            <Route path="idioma/:id" element={<EditarIdioma />} />
            <Route path="experiencias" element={<PreExperiencia />} />
            <Route path="experiencia/:id" element={<EditarExperiencia />} />
          </Route>
        </Route>

        {/* Ruta catch-all para 404 */}
        <Route path="*" element={<h1 className="text-white text-6xl font-bold">No found</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>

)
