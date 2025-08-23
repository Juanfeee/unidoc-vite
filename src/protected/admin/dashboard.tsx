import React, { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Paper,
  Divider,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning"; // 👈 agregado
import { toast } from "react-toastify";

const pages = [
  { label: "Inicio", key: "inicio" },
  { label: "Usuarios", key: "usuarios" },
  { label: "Reportes", key: "reportes" },
];

const fontFamily = "'Roboto', 'Montserrat', 'Segoe UI', Arial, sans-serif";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("inicio");
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para editar
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  // Estado para eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Descargar usuarios en Excel
  const fetchDatos = async () => {
    try {
      const response = await axiosInstance.get("/admin/usuarios-excel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "usuarios.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al descargar usuarios");
    }
  };

  // Buscar usuarios al abrir el modal
  React.useEffect(() => {
    if (openSearch) {
      setLoading(true);
      axiosInstance
        .get("/admin/listar-usuarios")
        .then((res) => setUsers(res.data))
        .catch(() => {
          setUsers([]);
          toast.error("Error al obtener usuarios");
        })
        .finally(() => setLoading(false));
    } else {
      setSearch("");
      setUsers([]);
    }
  }, [openSearch]);

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) =>
      user.primer_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      user.primer_apellido?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir modal eliminar
  const handleDelete = (id: number) => {
    setDeleteUserId(id);
    setOpenDelete(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      await toast.promise(
        axiosInstance.delete(`/admin/eliminar-usuario/${deleteUserId}`),
        {
          pending: "Eliminando usuario...",
          success: {
            render() {
              setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
              setOpenDelete(false);
              setDeleteUserId(null);
              setSearch("");
              return "Usuario eliminado correctamente";
            },
            autoClose: 2000,
          },
          error: "Error al eliminar usuario",
        }
      );
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Abrir modal de edición
  const handleEdit = (user: any) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  // Guardar cambios de edición con toast
  const handleSaveEdit = async () => {
    try {
      await toast.promise(
        axiosInstance.put(`/admin/editar-usuario/${editUser.id}`, editUser),
        {
          pending: "Guardando cambios...",
          success: {
            render() {
              setUsers((prev) =>
                prev.map((u) => (u.id === editUser.id ? editUser : u))
              );
              setOpenEdit(false);
              setEditUser(null);
              setSearch("");
              return "Usuario actualizado correctamente";
            },
            autoClose: 2000,
          },
          error: "Error al actualizar usuario",
        }
      );
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        fontFamily,
      }}
    >
      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid #e0e0e0",
            fontFamily,
          },
        }}
      >
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{ fontFamily }}
          >
            Panel Admin
          </Typography>
        </Box>
        <Divider />
        <List>
          {pages.map((page) => (
            <ListItem key={page.key} disablePadding>
              <ListItemButton
                selected={selectedPage === page.key}
                onClick={() => setSelectedPage(page.key)}
                sx={{
                  fontFamily,
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  bgcolor:
                    selectedPage === page.key ? "primary.light" : "inherit",
                }}
              >
                <ListItemText
                  primary={page.label}
                  primaryTypographyProps={{
                    fontWeight: selectedPage === page.key ? "bold" : "normal",
                    fontFamily,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Contenido */}
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            minWidth: 400,
            maxWidth: 600,
            width: "100%",
            borderRadius: 4,
            fontFamily,
          }}
        >
          {selectedPage === "inicio" && (
            <>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{ fontFamily, color: "primary.main" }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontFamily, color: "#555" }}
              >
                Bienvenido al panel de administración
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontFamily, color: "#888" }}>
                Selecciona una opción en el menú para comenzar.
              </Typography>
            </>
          )}

          {selectedPage === "usuarios" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 4,
                position: "relative",
              }}
            >
              {/* Caja para descarga de usuarios */}
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  minWidth: 300,
                  width: "100%",
                  maxWidth: 400,
                  mb: 4,
                  borderRadius: 3,
                  fontFamily,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontFamily, color: "primary.main" }}
                >
                  Usuarios
                </Typography>
                <Typography sx={{ fontFamily, color: "#555", mb: 2 }}>
                  Descarga el listado de usuarios en formato Excel.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={fetchDatos}
                  sx={{ mt: 2, fontFamily }}
                >
                  Descargar Usuarios (Excel)
                </Button>
              </Paper>

              {/* Botón para mostrar el buscador flotante */}
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  minWidth: 300,
                  width: "100%",
                  maxWidth: 400,
                  borderRadius: 3,
                  fontFamily,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontFamily, color: "primary.main" }}
                >
                  Buscar usuarios
                </Typography>
                <Typography sx={{ fontFamily, color: "#555", mb: 2 }}>
                  Accede al buscador para encontrar usuarios por nombre o correo.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontFamily }}
                  onClick={() => setOpenSearch(true)}
                >
                  Abrir buscador de usuarios
                </Button>
              </Paper>
            </Box>
          )}
          {selectedPage === "reportes" && (
            <>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ fontFamily, color: "primary.main" }}
              >
                Reportes
              </Typography>
              <Typography sx={{ fontFamily, color: "#555" }}>
                Próximamente podrás visualizar reportes aquí.
              </Typography>
            </>
          )}
        </Paper>
      </Box>

      {/* Modal flotante búsqueda */}
      <Modal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        aria-labelledby="modal-busqueda-usuarios"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            minWidth: 600,
            maxWidth: 700,
            borderRadius: 4,
            position: "relative",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 18, right: 18 }}
            onClick={() => setOpenSearch(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Buscar usuarios
          </Typography>
          <TextField
            fullWidth
            label="Nombre o correo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
            autoFocus
          />

          {loading ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Box sx={{ maxHeight: 350, overflowY: "auto", width: "100%" }}>
              {search.length === 0 ? (
                <Typography sx={{ color: "#888" }}>
                  Escribe para buscar usuarios...
                </Typography>
              ) : filteredUsers.length === 0 ? (
                <Typography>No se encontraron usuarios.</Typography>
              ) : (
                filteredUsers.map((user) => (
                  <Paper
                    key={user.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography>
                        {user.primer_nombre} {user.segundo_nombre}{" "}
                        {user.primer_apellido} {user.segundo_apellido}
                      </Typography>
                      <Typography>{user.email}</Typography>
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Modal>

      {/* Modal edición */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        aria-labelledby="modal-editar-usuario"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 5, minWidth: 200, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Editar usuario
          </Typography>
          {editUser && (
            <>
              <TextField
                fullWidth
                label="Primer nombre"
                value={editUser.primer_nombre}
                onChange={(e) =>
                  setEditUser({ ...editUser, primer_nombre: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Segundo nombre"
                value={editUser.segundo_nombre}
                onChange={(e) =>
                  setEditUser({ ...editUser, segundo_nombre: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Primer Apellido"
                value={editUser.primer_apellido}
                onChange={(e) =>
                  setEditUser({ ...editUser, primer_apellido: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Segundo Apellido"
                value={editUser.segundo_apellido}
                onChange={(e) =>
                  setEditUser({ ...editUser, segundo_apellido: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  onClick={() => setOpenEdit(false)}
                  sx={{ mr: 2 }}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} variant="contained">
                  Guardar
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      {/* Modal confirmación eliminación */}
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="modal-eliminar-usuario"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 5, minWidth: 350, borderRadius: 4, textAlign: "center" }}>
          <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography sx={{ mb: 3 }}>
            ¿Seguro que deseas eliminar este usuario?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Eliminar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenDelete(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Dashboard;