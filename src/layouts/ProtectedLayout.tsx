import { Outlet } from 'react-router-dom';
import Header from '../componentes/header';

export default function AspiranteLayouts() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
