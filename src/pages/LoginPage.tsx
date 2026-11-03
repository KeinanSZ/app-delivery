import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../services/api'
import { useAuth } from '../context/useAuth'

export function LoginPage() {
  const { signIn, token } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) return <Navigate to="/menu" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(username.trim(), password)
      navigate('/menu', { replace: true })
    } catch (reason) {
      const status = reason instanceof ApiError ? ` (status ${reason.status || 'sem resposta'})` : ''
      setError(`${reason instanceof Error ? reason.message : 'Não foi possível entrar.'}${status}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <a className="brand brand-light" href="#login" aria-label="Mesa do Pátio">
          <span className="brand-mark" aria-hidden="true">mp</span>
          <span className="brand-copy"><strong>mesa do pátio</strong><small>COZINHA COM AFETO</small></span>
        </a>
        <div className="story-copy">
          <span className="story-kicker"><i /> UM BOM DIA COMEÇA NA COZINHA</span>
          <h1>Seu cardápio,<br /><em>do seu jeito.</em></h1>
          <p>Cuide de cada detalhe dos seus pratos com a leveza que a sua cozinha merece.</p>
        </div>
        <div className="story-footer"><span>feito para quem faz com carinho</span><span>desde 2026</span></div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <span className="mobile-brand">mp · mesa do pátio</span>
          <span className="eyebrow">ÁREA DO RESTAURANTE</span>
          <h2>Que bom ter você<br />por aqui.</h2>
          <p className="login-intro">Entre na sua conta para organizar o cardápio.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Usuário</label>
            <div className="input-with-icon"><span aria-hidden="true">＠</span><input autoComplete="username" id="username" onChange={(event) => setUsername(event.target.value)} placeholder="Seu usuário" required value={username} /></div>
            <label htmlFor="password">Senha</label>
            <div className="input-with-icon"><span aria-hidden="true">⌑</span><input autoComplete="current-password" id="password" onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" required type="password" value={password} /></div>
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <button className="primary-button login-submit" disabled={loading} type="submit">{loading ? 'Entrando…' : 'Entrar no painel'} <span aria-hidden="true">→</span></button>
          </form>
          <div className="demo-hint"><span className="hint-icon" aria-hidden="true">✦</span><span><strong>Conta para demonstração</strong><br />Usuário <b>emilys</b> · senha <b>emilyspass</b></span></div>
          <p className="login-legal">Acesso seguro para parceiros da Mesa do Pátio.</p>
        </div>
      </section>
    </main>
  )
}
