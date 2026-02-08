import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";
import { formatApiError } from "@/lib/errorFormatter";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If already authenticated, redirect to catalog
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('authToken');
    if (token) {
      if (mounted) navigate('/catalog');
    }
    return () => { mounted = false; };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password1 !== password2) return setError("Passwords do not match");
    try {
      // Get CSRF token from backend
      const csrfRes = await fetch(`${API_BASE}/auth/csrf/`, { 
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      let csrfToken: string | null = null;
      try {
        const csrfData = await csrfRes.json();
        csrfToken = csrfData?.csrfToken;
      } catch (e) {
        console.warn('Failed to parse CSRF response', e);
      }

      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken })
        },
        body: JSON.stringify({ username, email, company_name: companyName || 'dada', password1, password2 }),
        credentials: "include"
      });
      
      const txt = await res.text();
      if (!res.ok) {
        throw new Error(formatApiError(txt));
      }
      
      // Successfully registered. Now auto-login the user.
      const loginRes = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken })
        },
        body: JSON.stringify({ username, password: password1 }),
        credentials: "include"
      });
      
      const loginTxt = await loginRes.text();
      if (!loginRes.ok) {
        throw new Error(formatApiError(loginTxt));
      }
      
      let loginData: any = null;
      try {
        loginData = loginTxt ? JSON.parse(loginTxt) : null;
      } catch (e) {
        console.warn('Failed to parse login response:', e);
        // User was registered but login parsing failed - redirect to signin
        navigate("/");
        return;
      }
      
      if (loginData?.key) {
        localStorage.setItem('authToken', loginData.key);
        setError(null);
        navigate("/catalog");
      } else {
        // Registration succeeded but login failed - redirect to signin page
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Create account</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Username</span>
          <input className="mt-1 block w-full border rounded px-2 py-1" value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input className="mt-1 block w-full border rounded px-2 py-1" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Company Name</span>
          <input className="mt-1 block w-full border rounded px-2 py-1" placeholder="Your company name (or dada if not available)" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 block w-full border rounded px-2 py-1" value={password1} onChange={e=>setPassword1(e.target.value)} />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Confirm Password</span>
          <input type="password" className="mt-1 block w-full border rounded px-2 py-1" value={password2} onChange={e=>setPassword2(e.target.value)} />
        </label>
        <div className="flex items-center justify-between">
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Create account</button>
          <a className="text-sm text-blue-600" href="/">Sign in</a>
        </div>
      </form>
    </div>
  );
}
