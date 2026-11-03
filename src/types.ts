export interface Recipe {
  id: number
  name: string
  cuisine: string
  image: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings?: number
  difficulty?: string
  localKey?: string
}

export type RecipeInput = Pick<
  Recipe,
  'name' | 'cuisine' | 'image' | 'prepTimeMinutes' | 'cookTimeMinutes'
>

export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email?: string
  image?: string
}

export interface LoginResponse extends User {
  accessToken?: string
  token?: string
}

export interface ApiListResponse {
  recipes: Recipe[]
  total: number
  skip: number
  limit: number
}
