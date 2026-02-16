import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/entities/tenant/TenantContext";
import { useAuth } from "@/entities/auth/AuthContext";
import type { Role } from "@/entities/auth/AuthContext";

interface Credential {
  email: string;
  password: string;
  role: Role;
  name: string;
}

const MOCK_CREDENTIALS: Record<string, Credential[]> = {
  clinic: [
    {
      email: "admin@clinica.com",
      password: "admin123",
      role: "admin",
      name: "Alex Torrez",
    },
    {
      email: "recepcion@clinica.com",
      password: "recepcion123",
      role: "receptionist",
      name: "Laura Salas",
    },
    {
      email: "dra.perez@clinica.com",
      password: "doctor123",
      role: "staff",
      name: "Dra. Ana Pérez",
    },
  ],
  barbershop: [
    {
      email: "admin@barberking.com",
      password: "admin123",
      role: "admin",
      name: "Alex Torrez",
    },
    {
      email: "recepcion@barberking.com",
      password: "recepcion123",
      role: "receptionist",
      name: "Sofía Rojas",
    },
    {
      email: "marco@barberking.com",
      password: "barbero123",
      role: "staff",
      name: "Marco Jiménez",
    },
  ],
  restaurant: [
    {
      email: "admin@lamesadorada.com",
      password: "admin123",
      role: "admin",
      name: "Alex Torrez",
    },
    {
      email: "host@lamesadorada.com",
      password: "host123",
      role: "receptionist",
      name: "Valeria Campos",
    },
    {
      email: "carlos@lamesadorada.com",
      password: "mesero123",
      role: "staff",
      name: "Carlos Montero",
    },
  ],
};

const LoginPage = () => {
  const tenant = useTenant();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const credentials =
      MOCK_CREDENTIALS[tenant.type] ?? MOCK_CREDENTIALS.clinic;
    const match = credentials.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password,
    );

    if (!match) {
      setError("Credenciales incorrectas");
      return;
    }

    login(match.role, match.name);
    navigate("/");
  };

  const primaryColor = tenant.branding?.primaryColor ?? "#6366f1";
  const accentColor = tenant.branding?.accentColor ?? "#818cf8";
  const credentials = MOCK_CREDENTIALS[tenant.type] ?? MOCK_CREDENTIALS.clinic;

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}10)`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[380px] space-y-6 bg-white p-8 shadow-xl rounded-xl border border-gray-100"
      >
        {tenant.branding?.logo && (
          <img
            src={tenant.branding.logo}
            alt={tenant.name}
            className="mx-auto h-12 object-contain"
          />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresá a tu cuenta</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 14px ${primaryColor}40`,
          }}
        >
          Iniciar sesión
        </button>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Cuentas de prueba
          </p>
          <div className="space-y-1">
            {credentials.map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => {
                  setEmail(c.email);
                  setPassword(c.password);
                  setError("");
                }}
                className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <span className="text-gray-600 group-hover:text-gray-900 font-medium">
                  {c.email}
                </span>
                <span className="text-gray-400 ml-2">({c.role})</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-gray-400">
          Powered by{" "}
          <span className="font-medium text-gray-500">DETDevs Booking</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
