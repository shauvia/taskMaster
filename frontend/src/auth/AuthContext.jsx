import { createContext, useContext, useState, useEffect } from "react";
const myApi = "/api";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevents flicker on refresh
  //  Check if user is logged in on first load
  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const register = async (credentials) => {
    const response = await fetch(myApi + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw Error(errorData.error);
    }
    console.log("response", response);
    const result = await response.json();
    console.log("result", result);
    setUser(result.user || null);
    // const raw = await response.text();
    // console.log("RAW RESPONSE:", raw);
  };

  const login = async (credentials) => {
    console.log("credentials", credentials);
    const response = await fetch(myApi + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw Error(errorData.error);
    }
    console.log("login, response", response);
    const result = await response.json();
    setUser(result.user || null);
    return result;
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(myApi + "/users/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        console.error(
          "checkAuth failed:",
          response.status,
          response.statusText,
        );
      }
    } catch (err) {
      console.error("checkAuth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch(myApi + "/users/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  const value = {
    register,
    login,
    logout,
    user,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
