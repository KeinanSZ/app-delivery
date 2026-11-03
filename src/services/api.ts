import type { ApiListResponse, LoginResponse, Recipe, RecipeInput, User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

export class ApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique sua internet.', 0)
  }

  const payload = await response.json().catch(() => ({})) as { message?: string }
  if (!response.ok) {
    throw new ApiError(payload.message || 'A solicitação não foi concluída.', response.status)
  }
  return payload as T
}

export function loginRequest(username: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  })
}

export function getCurrentUser(token: string) {
  return request<User>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getRecipes() {
  return request<ApiListResponse>('/recipes?limit=100&select=id,name,cuisine,image,prepTimeMinutes,cookTimeMinutes,servings,difficulty')
}

export function createRecipe(recipe: RecipeInput) {
  return request<Recipe>('/recipes/add', {
    method: 'POST',
    body: JSON.stringify(recipe),
  })
}

export function updateRecipe(id: number, recipe: RecipeInput) {
  return request<Recipe>(`/recipes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(recipe),
  })
}

export function deleteRecipe(id: number) {
  return request<{ id: number; isDeleted: boolean }>(`/recipes/${id}`, {
    method: 'DELETE',
  })
}
