# BookingAdmon

Sistema de gestión de reservas (Booking) desarrollado con **React**, **TypeScript** y **Vite**, ideal para negocios como clínicas, peluquerías, consultorios, entre otros.

## 🛠 Tecnologías principales

- **React 18** + **Vite** para un desarrollo veloz y moderno
- **TypeScript** para tipado estático
- **TailwindCSS** + **tw-animate-css** para estilos rápidos y animaciones
- **Zustand** para manejo global de estado
- **React Hook Form** + **Zod** para formularios y validaciones
- **Radix UI** para componentes accesibles y personalizables
- **React Google ReCAPTCHA v2** para protección contra bots
- **React Query** para manejo eficiente de datos asincrónicos
- **MUI (Material UI)** para componentes adicionales de UI
- **React Router DOM** v7 para navegación SPA
- **Recharts** para gráficas

## 🔐 Funcionalidades destacadas

- Modal de autenticación protegido por ReCAPTCHA
- Flujo multistep (4 pasos) para reservas de servicio:
  1. Selección de servicio y tamaño
  2. Selección de encargado
  3. Fecha y hora disponible
  4. Confirmación del cliente
- Sidebar con resumen en tiempo real del proceso
- Diseño responsive y limpio
- Soporte para múltiples centros, servicios, usuarios y clientes

## 📦 Scripts disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila la aplicación para producción
npm run preview   # Muestra una vista previa de producción
npm run lint      # Corre ESLint para mantener calidad del código

🧱 Estructura recomendada

src/
├── api/               # Lógica para consumir endpoints
├── components/        # Componentes reutilizables (modales, inputs, etc.)
├── features/          # Módulos por dominio (clientes, servicios, ventas, etc.)
├── hooks/             # Custom hooks
├── pages/             # Páginas principales (Login, BookingFlow, Dashboard)
├── router/            # Configuración de rutas
├── store/             # Global state con Zustand
├── utils/             # Helpers y constantes
└── styles/            # Estilos globales (Tailwind, animaciones)

📋 ESLint y buenas prácticas
Este proyecto incluye reglas básicas de ESLint con soporte para TypeScript y React. Puedes expandir la configuración agregando:

eslint-plugin-react-x

eslint-plugin-react-dom

Reglas estrictas con typescript-eslint

🌐 Requisitos
Node.js >= 18

Navegador moderno

Cuenta válida de reCAPTCHA (v2)

🚀 Cómo iniciar

git clone https://github.com/tu-usuario/bookingadmon.git
cd bookingadmon
npm install
npm run dev

📄 Licencia
MIT - Creado por Edwin T.