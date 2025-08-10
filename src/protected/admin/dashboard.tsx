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
    }
  };

  // Buscar usuarios al abrir el modal o al cambiar el texto
  React.useEffect(() => {
    if (openSearch) {
      setLoading(true);
      axiosInstance
        .get("/admin/listar-usuarios") // <-- Cambia aquí
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    } else {
      setSearch("");
      setUsers([]);
    }
  }, [openSearch]);

  // Filtrar usuarios por nombre o email
  const filteredUsers = users.filter(
    (user) =>
      user.primer_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      user.primer_apellido?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        fontFamily,
      }}
    >
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
            boxShadow:
              "0 4px 20px 0 rgba(0,0,0,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.06)",
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

      {/* Modal flotante para búsqueda, solo aparece al dar clic en el botón */}
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
            fontFamily,
            position: "relative",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 18, right: 18 }}
            onClick={() => setOpenSearch(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontFamily, mb: 3, color: "primary.main" }}
          >
            Buscar usuarios
          </Typography>
          <TextField
            fullWidth
            label="Nombre o correo"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3, fontFamily }}
            autoFocus
          />
          {loading ? (
            <Typography sx={{ fontFamily }}>Cargando...</Typography>
          ) : (
            <Box sx={{ maxHeight: 350, overflowY: "auto", width: "100%" }}>
              {search.length === 0 ? (
                <Typography sx={{ fontFamily, color: "#888" }}>
                  Escribe para buscar usuarios...
                </Typography>
              ) : filteredUsers.length === 0 ? (
                <Typography sx={{ fontFamily }}>
                  No se encontraron usuarios.
                </Typography>
              ) : (
                filteredUsers.map((user) => (
                  <Paper key={user.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Typography>
                      {user.primer_nombre} {user.segundo_nombre} {user.primer_apellido}{" "}
                      {user.segundo_apellido}
                    </Typography>
                    <Typography>{user.email}</Typography>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default Dashboard;