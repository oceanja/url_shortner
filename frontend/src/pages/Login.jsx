import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:9001";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
    <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        URL Shortener 🚀
      </h2>

      <input
        className="w-full mb-4 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full mb-6 p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg hover:bg-indigo-700 transition shadow"
      >
        Login
      </button>

    </div>
  </div>
);
}
