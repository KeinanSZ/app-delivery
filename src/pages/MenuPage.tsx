import { useCallback, useEffect, useMemo, useState } from 'react'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeFormModal } from '../components/RecipeFormModal'
import { Topbar } from '../components/Topbar'
import { ApiError, createRecipe, deleteRecipe, getRecipes, updateRecipe } from '../services/api'
import type { Recipe, RecipeInput } from '../types'

function errorMessage(reason: unknown) {
  const status = reason instanceof ApiError ? ` · status ${reason.status || 'sem resposta'}` : ''
  const message = reason instanceof Error ? reason.message : 'Ocorreu um erro inesperado.'
  return `${message}${status}`
}

export function MenuPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await getRecipes()
      setRecipes(response.recipes)
    } catch (reason) {
      setError(errorMessage(reason))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadRecipes = useCallback(async () => {
    setLoading(true)
    setError('')
    await fetchRecipes()
  }, [fetchRecipes])

  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { void fetchRecipes() }, [fetchRecipes])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 5500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const visibleRecipes = useMemo(() => recipes.filter((recipe) =>
    `${recipe.name} ${recipe.cuisine}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')),
  ), [recipes, query])

  function openCreateForm() {
    setEditingRecipe(null)
    setModalOpen(true)
  }

  function openEditForm(recipe: Recipe) {
    setEditingRecipe(recipe)
    setModalOpen(true)
  }

  async function saveRecipe(values: RecipeInput) {
    setSaving(true)
    setError('')
    try {
      if (editingRecipe) {
        try {
          const updated = await updateRecipe(editingRecipe.id, values)
          setRecipes((current) => current.map((item) => item.localKey === editingRecipe.localKey && item.localKey
            ? { ...item, ...values }
            : item.id === editingRecipe.id ? { ...item, ...updated, ...values } : item))
        } catch (reason) {
          if (!(editingRecipe.localKey && reason instanceof ApiError && reason.status === 404)) throw reason
          setRecipes((current) => current.map((item) => item.localKey === editingRecipe.localKey ? { ...item, ...values } : item))
          setNotice('A API simulada retornou 404 para o prato novo. A edição foi aplicada nesta sessão.')
        }
        if (!editingRecipe.localKey) setNotice('Prato atualizado com sucesso.')
      } else {
        const created = await createRecipe(values)
        const localRecipe: Recipe = {
          ...values,
          id: created.id || 51,
          servings: created.servings,
          difficulty: created.difficulty,
          localKey: `local-${Date.now()}`,
        }
        setRecipes((current) => [localRecipe, ...current])
        setNotice('Prato adicionado ao cardápio. A API de demonstração mantém a alteração apenas nesta sessão.')
      }
      setModalOpen(false)
      setEditingRecipe(null)
    } catch (reason) {
      setError(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  async function removeRecipe(recipe: Recipe) {
    if (!window.confirm(`Tem certeza que deseja excluir “${recipe.name}” do cardápio?`)) return
    setError('')
    try {
      try {
        await deleteRecipe(recipe.id)
      } catch (reason) {
        if (!(recipe.localKey && reason instanceof ApiError && reason.status === 404)) throw reason
        setRecipes((current) => current.filter((item) => item.localKey !== recipe.localKey))
        setNotice('A API simulada retornou 404 para o prato novo. Ele foi removido desta sessão.')
        return
      }
      setRecipes((current) => current.filter((item) => item.localKey
        ? item.localKey !== recipe.localKey
        : item.id !== recipe.id))
      setNotice('Prato removido do cardápio.')
    } catch (reason) {
      setError(errorMessage(reason))
    }
  }

  const totalMinutes = recipes.reduce((sum, recipe) => sum + recipe.prepTimeMinutes + recipe.cookTimeMinutes, 0)
  const averageMinutes = recipes.length ? Math.round(totalMinutes / recipes.length) : 0

  return (
    <div className="dashboard-page">
      <Topbar />
      <main className="dashboard-main">
        <section className="welcome-row">
          <div>
            <span className="eyebrow">TERÇA-FEIRA · COZINHA EM MOVIMENTO</span>
            <h1>Seu cardápio <em>de hoje.</em></h1>
            <p>Um bom prato conta uma história. Vamos cuidar da sua?</p>
          </div>
          <button className="primary-button add-recipe-button" onClick={openCreateForm} type="button"><span aria-hidden="true">＋</span> Novo prato</button>
        </section>

        <section className="summary-grid" aria-label="Resumo do cardápio">
          <article className="summary-card summary-primary"><span className="summary-icon" aria-hidden="true">✳</span><div><span>PRATOS NO CARDÁPIO</span><strong>{recipes.length.toString().padStart(2, '0')}</strong></div><small>opções para servir</small></article>
          <article className="summary-card"><span className="summary-icon summary-icon-warm" aria-hidden="true">◷</span><div><span>TEMPO MÉDIO</span><strong>{averageMinutes}<small> min</small></strong></div><small>do preparo à mesa</small></article>
          <article className="summary-card"><span className="summary-icon summary-icon-green" aria-hidden="true">⌕</span><div><span>BUSCA RÁPIDA</span><strong>{visibleRecipes.length.toString().padStart(2, '0')}</strong></div><small>{query ? 'resultados encontrados' : 'pratos disponíveis'}</small></article>
        </section>

        <section className="menu-section">
          <div className="menu-heading">
            <div><span className="eyebrow">FEITO COM CUIDADO</span><h2>Pratos da casa <span className="heading-count">{recipes.length}</span></h2></div>
            <button className="refresh-button" onClick={() => void loadRecipes()} type="button" disabled={loading}><span aria-hidden="true">↻</span> Atualizar lista</button>
          </div>
          <div className="menu-toolbar">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Buscar pratos" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por prato ou cozinha…" value={query} />{query && <button aria-label="Limpar busca" onClick={() => setQuery('')} type="button">×</button>}</label>
            <span className="list-caption">{loading ? 'Carregando…' : `${visibleRecipes.length} ${visibleRecipes.length === 1 ? 'prato' : 'pratos'}`}</span>
          </div>

          {error && <div className="alert alert-error page-alert" role="alert"><span>{error}</span><button onClick={() => void loadRecipes()} type="button">Tentar novamente</button></div>}
          {notice && <div className="alert alert-success page-alert" role="status"><span>✓ {notice}</span><button aria-label="Fechar aviso" onClick={() => setNotice('')} type="button">×</button></div>}

          {loading ? (
            <div className="loading-grid" aria-label="Carregando pratos">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item}><div /><span /><span /></div>)}</div>
          ) : visibleRecipes.length ? (
            <div className="recipe-grid">{visibleRecipes.map((recipe) => <RecipeCard key={recipe.localKey || recipe.id} onDelete={removeRecipe} onEdit={openEditForm} recipe={recipe} />)}</div>
          ) : (
            <div className="empty-state"><span aria-hidden="true">⌕</span><h3>{query ? 'Nenhum prato por aqui.' : 'Seu cardápio está vazio.'}</h3><p>{query ? 'Tente outra busca ou confira a grafia.' : 'Adicione o primeiro prato para começar a montar sua vitrine.'}</p>{!query && <button className="primary-button" onClick={openCreateForm} type="button">＋ Adicionar primeiro prato</button>}</div>
          )}
        </section>
        <footer className="dashboard-footer"><span>mesa do pátio <i>·</i> painel do restaurante</span><span>feito com cuidado, servido com afeto</span></footer>
      </main>
      {modalOpen && <RecipeFormModal key={editingRecipe?.localKey || editingRecipe?.id || 'new'} onClose={() => { setModalOpen(false); setEditingRecipe(null) }} onSave={saveRecipe} recipe={editingRecipe} saving={saving} />}
    </div>
  )
}
