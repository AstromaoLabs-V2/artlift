'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("http://localhost:8000/api/auth/login/", 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      setError("Invalid credentials")
      return
    }

    const data = await res.json()

    // store token
    localStorage.setItem("access_token", data.access)
    localStorage.setItem("refresh_token", data.refresh)

    // redirect after login
    router.push("/")
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Sign In</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Sign In</button>
    </form>
  )
}
