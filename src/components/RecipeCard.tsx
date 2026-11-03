import type { Recipe } from '../types'

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const price = 15 + 0.5 * (recipe.prepTimeMinutes + recipe.cookTimeMinutes)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img
          className="recipe-image"
          src={recipe.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.name}
          loading="lazy"
        />
        <span className="cuisine-badge">{recipe.cuisine || 'Da casa'}</span>
        {recipe.localKey && <span className="local-badge">NOVO</span>}
      </div>
      <div className="recipe-content">
        <div className="recipe-title-row">
          <h3>{recipe.name}</h3>
          <strong className="recipe-price">{formattedPrice}</strong>
        </div>
        <div className="recipe-meta">
          <span><span aria-hidden="true">◷</span> {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
          <span><span aria-hidden="true">♨</span> {recipe.difficulty || 'Artesanal'}</span>
        </div>
        <div className="recipe-actions">
          <button className="edit-button" onClick={() => onEdit(recipe)} type="button">Editar prato</button>
          <button className="icon-button delete-button" onClick={() => onDelete(recipe)} type="button" aria-label={`Excluir ${recipe.name}`} title="Excluir prato">⌫</button>
        </div>
      </div>
    </article>
  )
}
