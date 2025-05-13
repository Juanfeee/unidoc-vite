import axiosInstance from "../../utils/axiosConfig";

const Dashboard = () => {
  // Traer los usuarios del excel
  const fetchDatos = async () => {
    try {
      // Obtener datos del servidor como blob
      const response = await axiosInstance.get('/admin/usuarios-excel', {
        responseType: 'blob'
      });
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Crear un enlace temporal
      const link = document.createElement('a');
      link.href = url;
      
      // Establecer el nombre del archivo 
      link.setAttribute('download', 'usuarios.xlsx');
      
      // Añadir el enlace al DOM y hacer click
      document.body.appendChild(link);
      link.click();
      
      // Limpiar después de la descarga
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };
  
  return (
    <div className='flex flex-col bg-white items-center justify-center min-h-screen w-full'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <p className='text-lg'>Bienvenido al panel de administración</p>
      <div className='flex flex-col items-center justify-center mt-4'>
        <button 
          onClick={fetchDatos} // Añadir el evento onClick al botón
          className='bg-green-500 text-white px-4 py-2 rounded mt-2'
        >
          Descargar Usuarios (Excel)
        </button>
      </div>
    </div>
  )
}

export default Dashboard;