import { createContext, useContext, useState, useCallback } from "react";

export type Role = "admin" | "receptionist" | "staff";

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  userName: string;
  login: (role?: Role, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  role: "admin",
  userName: "",
  login: () => {},
  logout: () => {},
});

const AUTH_KEY = "det:authenticated";
const ROLE_KEY = "det:role";
const NAME_KEY = "det:userName";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === "true",
  );
  const [role, setRole] = useState<Role>(
    () => (localStorage.getItem(ROLE_KEY) as Role) || "admin",
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem(NAME_KEY) || "",
  );

  const login = useCallback((r: Role = "admin", name: string = "") => {
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(ROLE_KEY, r);
    localStorage.setItem(NAME_KEY, name);
    setIsAuthenticated(true);
    setRole(r);
    setUserName(name);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    setIsAuthenticated(false);
    setRole("admin");
    setUserName("");
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
