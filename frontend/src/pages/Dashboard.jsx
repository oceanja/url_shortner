import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ token, setToken }) {
  const [urls, setUrls] = useState([]);
  const [original, setOriginal] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:9001/url/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUrls(res.data));
  }, []);

  const createUrl = async () => {
    await axios.post(
      "http://127.0.0.1:9001/url/shorten",
      { original_url: original },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My URLs</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Paste long URL"
          onChange={(e) => setOriginal(e.target.value)}
        />
        <button
          onClick={createUrl}
          className="bg-green-500 text-white px-4"
        >
          Shorten
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Short</th>
            <th>Original</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u.short_code}>
              <td>
                <a
                  href={`http://127.0.0.1:9001/${u.short_code}`}
                  className="text-blue-500"
                >
                  {u.short_code}
                </a>
              </td>
              <td>{u.original_url}</td>
              <td>{u.click_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
