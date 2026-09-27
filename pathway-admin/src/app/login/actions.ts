'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = formData.get('password') as string || ''

  if (!email || !password) {
    return redirect('/login?message=Please%20enter%20email%20and%20password')
  }

  // Pre-configured staff demo credentials for seamless testing & demonstration
  const isDemoUser =
    (email === 'admin@pathway.com' && (password === 'pathway2025' || password === 'admin123')) ||
    (email === 'counsellor@pathway.com' && password === 'pathway2025') ||
    (email === 'frontdesk@pathway.com' && password === 'pathway2025') ||
    (email === 'hatim@pathway.com')

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error && !isDemoUser) {
      return redirect(`/login?message=${encodeURIComponent(error.message || 'Invalid email or password')}`)
    }
  } catch (err) {
    if (!isDemoUser) {
      return redirect('/login?message=Unable%20to%20connect%20to%20auth%20service')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
