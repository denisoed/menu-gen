export interface MenuContactInfo {
  phone?: string
  email?: string
  website?: string
  messenger?: string
}

export interface MenuDishFixture {
  id: string
  name?: string
  description?: string
  price?: number
  currency?: string
  image?: string
  popular?: boolean
  tags?: string[]
  orderUrl?: string
  allergens?: string[]
  spicyLevel?: number
}

export interface MenuCategoryFixture {
  id: string
  name?: string
  description?: string
  dishes?: MenuDishFixture[]
}

export interface MenuFixture {
  id: string
  name?: string
  description?: string
  location?: string
  cuisines?: string[]
  bannerImages?: string[]
  categories?: MenuCategoryFixture[]
  contact?: MenuContactInfo
  hours?: string
  currency?: string
}

export interface MenuDish {
  id: string
  name: string
  description: string
  price: number | null
  currency: string | null
  image: string | null
  popular: boolean
  tags: string[]
  orderUrl: string | null
  allergens: string[]
  spicyLevel: number | null
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  dishes: MenuDish[]
}

export interface MenuDefinition {
  id: string
  name: string
  description: string
  location: string | null
  cuisines: string[]
  bannerImages: string[]
  categories: MenuCategory[]
  contact: MenuContactInfo
  hours: string | null
  currency: string | null
}

export interface CategoryOption {
  id: string
  name: string
  dishCount: number
}

export interface HighlightedDish extends MenuDish {
  categoryId: string
  categoryName: string
}
