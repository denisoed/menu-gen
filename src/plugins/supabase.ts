import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { inject, type App, type InjectionKey } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is not defined')
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is not defined')
}

const client = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseClientKey: InjectionKey<SupabaseClient> = Symbol('SupabaseClient')

export const installSupabase = (app: App): void => {
  app.provide(supabaseClientKey, client)
}

export const useSupabaseClient = (): SupabaseClient => {
  const instance = inject(supabaseClientKey)
  if (!instance) {
    throw new Error('Supabase client is not provided. Did you call installSupabase()?')
  }

  return instance
}

export const supabaseClient = client
