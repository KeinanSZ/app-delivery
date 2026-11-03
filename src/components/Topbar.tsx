import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function Topbar() {
  const { user, signOut } = useAuth()
  const firstName = user?.firstName || user?.username || 'Parceiro'

  return (
    <header className="topbar">
      <Link className="brand" to="/menu" aria-label="Mesa do Pátio — início">
        <span className="brand-mark" aria-hidden="true">mp</span>
        <span className="brand-copy"><strong>mesa do pátio</strong><small>PAINEL DO RESTAURANTE</small></span>
      </Link>
      <div className="topbar-right">
        <span className="open-status"><i /> Operação ativa</span>
        <span className="user-greeting">Olá, {firstName}</span>
        <button className="logout-button" onClick={signOut} type="button">
          <span aria-hidden="true">↗</span> Sair
        </button>
      </div>
    </header>
  )
}
