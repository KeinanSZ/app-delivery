import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Recipe, RecipeInput } from '../types'

interface RecipeFormModalProps {
  recipe: Recipe | null
  saving: boolean
  onClose: () => void
  onSave: (values: RecipeInput) => Promise<void>
}

const emptyValues: RecipeInput = {
  name: '',
  cuisine: '',
  image: '',
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
}

export function RecipeFormModal({ recipe, saving, onClose, onSave }: RecipeFormModalProps) {
  const [values, setValues] = useState<RecipeInput>(() => recipe ? {
    name: recipe.name,
    cuisine: recipe.cuisine,
    image: recipe.image,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
  } : emptyValues)
  const [validationMessage, setValidationMessage] = useState('')

  function updateField<K extends keyof RecipeInput>(field: K, value: RecipeInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!values.name.trim() || !values.cuisine.trim()) {
      setValidationMessage('Preencha o nome do prato e a cozinha.')
      return
    }
    await onSave({
      ...values,
      name: values.name.trim(),
      cuisine: values.cuisine.trim(),
      image: values.image.trim() || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose()
    }}>
      <section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">CARDÁPIO DA CASA</span>
            <h2 id="recipe-modal-title">{recipe ? 'Editar prato' : 'Novo prato'}</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Fechar" disabled={saving}>×</button>
        </div>
        <form className="recipe-form" onSubmit={handleSubmit}>
          <label>Nome do prato<input autoFocus maxLength={70} onChange={(event) => updateField('name', event.target.value)} placeholder="Ex.: Nhoque da nonna" value={values.name} /></label>
          <label>Tipo de cozinha<input maxLength={40} onChange={(event) => updateField('cuisine', event.target.value)} placeholder="Ex.: Italiana" value={values.cuisine} /></label>
          <label className="full-field">Link da foto<input onChange={(event) => updateField('image', event.target.value)} placeholder="https://… (opcional)" type="url" value={values.image} /></label>
          <div className="time-fields">
            <label>Preparo (min)<input min={0} onChange={(event) => updateField('prepTimeMinutes', Number(event.target.value))} type="number" value={values.prepTimeMinutes} /></label>
            <label>Cozimento (min)<input min={0} onChange={(event) => updateField('cookTimeMinutes', Number(event.target.value))} type="number" value={values.cookTimeMinutes} /></label>
          </div>
          <p className="form-price-note">Preço sugerido: R$ {(15 + 0.5 * (values.prepTimeMinutes + values.cookTimeMinutes)).toFixed(2).replace('.', ',')}</p>
          {validationMessage && <p className="form-validation" role="alert">{validationMessage}</p>}
          <div className="modal-actions">
            <button className="cancel-button" disabled={saving} onClick={onClose} type="button">Cancelar</button>
            <button className="primary-button" disabled={saving} type="submit">{saving ? 'Salvando…' : recipe ? 'Salvar alterações' : 'Adicionar ao cardápio'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
