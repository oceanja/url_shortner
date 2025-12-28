import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ token, setToken }) {
  const [urls, setUrls] = useState([]);
  const [original, setOriginal] = useState("");
  const [error, setError] = useState("");

  const fetchUrls = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:9001/url/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(res.data);
    } catch (err) {
      setError("Unable to load URLs");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const createUrl = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:9001/url/shorten",
        { original_url: original },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOriginal("");
      fetchUrls();          
    } catch (err) {
      setError("Failed to shorten URL");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center items-start pt-16">
    <div className="w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          🔗 My Short Links
        </h1>
        <button onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          value={original}
          className="flex-1 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Paste your long URL here..."
          onChange={(e) => setOriginal(e.target.value)}
        />
        <button onClick={createUrl}
          className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 transition shadow">
          Shorten 🚀
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Short</th>
              <th className="p-4 text-left">Original URL</th>
              <th className="p-4 text-center">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((u) => (
              <tr key={u.short_code} className="border-t hover:bg-white transition">
                <td className="p-4 flex gap-3 items-center">
                  <a
                    href={`http://127.0.0.1:9001/${u.short_code}`}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    {u.short_code}
                  </a>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(`http://127.0.0.1:9001/${u.short_code}`)
                    }
                    className="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </td>
                <td className="p-4 text-gray-700 truncate max-w-xs">
                  {u.original_url}
                </td>
                <td className="p-4 text-center font-medium">{u.click_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);
}