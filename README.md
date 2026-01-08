# YectosPro 2.0

Plataforma profesional de gestión de proyectos y facturación construida con tecnologías modernas.

## 🚀 Características

- ✨ Interfaz moderna y profesional con animaciones fluidas
- 📊 Dashboard interactivo con estadísticas en tiempo real
- 📁 Gestión completa de proyectos con etapas personalizables
- 💰 Control financiero con seguimiento de pagos
- 🎨 Modo oscuro/claro/automático
- 📱 Diseño responsive (móvil, tablet, desktop)
- 🔐 Autenticación segura con Firebase (Email/Password y Google OAuth)
- ⚡ Performance optimizado con code splitting
- 🔄 Sincronización en tiempo real
- 🎯 TypeScript para mayor robustez

## 🛠️ Tecnologías

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **Zustand** - State management
- **React Query** - Data fetching y caché
- **Recharts** - Visualización de datos

### Backend
- **Firebase Auth** - Autenticación
- **Cloud Firestore** - Base de datos NoSQL
- **Firebase Hosting** - Hosting de aplicación

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 🔥 Despliegue

```bash
# Desplegar a Firebase
npm run build
firebase deploy
```

## 📄 Estructura del Proyecto

```
yectospro/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Autenticación
│   │   ├── dashboard/  # Dashboard
│   │   ├── layout/     # Layout principal
│   │   ├── projects/   # Gestión de proyectos
│   │   └── ui/         # Componentes UI base
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Configuraciones (Firebase)
│   ├── pages/          # Páginas principales
│   ├── store/          # Estado global (Zustand)
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Utilidades
│   ├── App.tsx         # Componente raíz
│   ├── main.tsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── public/             # Assets estáticos
├── firebase.json       # Configuración Firebase
├── firestore.rules     # Reglas de seguridad
├── vite.config.ts      # Configuración Vite
└── package.json        # Dependencias

```

## 🔒 Seguridad

- Autenticación requerida para todas las operaciones
- Reglas de Firestore configuradas para acceso solo a datos propios
- Validaciones client-side y server-side
- Variables de entorno para configuraciones sensibles

## 📝 Licencia

© 2024 YectosPro. Todos los derechos reservados.

## 🤝 Contribución

Este es un proyecto privado. Para contribuir, contacta al administrador del repositorio.

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades, abre un issue en GitHub.
