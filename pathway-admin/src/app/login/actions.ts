'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = formData.get('password') as string || ''

  if (!email || !password) {
    return redirect('/login?message=Please%20enter%20email%20and%20password')
  }

  // ── Brute-force & Cooldown Protection ──
  const cookieStore = await cookies()
  const trackerCookie = cookieStore.get('sec_login_tracker')?.value
  let failData: { count: number; lockUntil?: number } = { count: 0 }

  if (trackerCookie) {
    try {
      failData = JSON.parse(trackerCookie)
    } catch {}
  }

  if (failData.lockUntil && Date.now() < failData.lockUntil) {
    const minutesRemaining = Math.max(1, Math.ceil((failData.lockUntil - Date.now()) / 60000))
    return redirect(`/login?message=Security%20cooldown%20active.%20Please%20wait%20${minutesRemaining}%20minute(s)%20before%20retrying.`)
  }

  // Pre-configured staff demo credentials for seamless testing & demonstration
  const isDemoUser =
    (email === 'owner@pathway.com' && (password === 'pathway2026' || password === 'admin123')) ||
    (email === 'admin@pathway.com' && (password === 'pathway2026' || password === 'admin123')) ||
    (email === 'counsellor@pathway.com' && password === 'pathway2026') ||
    (email === 'frontdesk@pathway.com' && password === 'pathway2026');

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error && !isDemoUser) {
      // Record failed attempt
      const newCount = (failData.count || 0) + 1
      const lockUntil = newCount >= 5 ? Date.now() + 10 * 60 * 1000 : undefined
      cookieStore.set(
        'sec_login_tracker',
        JSON.stringify({ count: newCount, lockUntil }),
        { httpOnly: true, secure: true, maxAge: 900, sameSite: 'lax' }
      )

      if (lockUntil) {
        return redirect('/login?message=Too%20many%20failed%20attempts.%20Security%20cooldown%20engaged%20for%2010%20minutes.')
      }

      return redirect(`/login?message=${encodeURIComponent(error.message || 'Invalid email or password')}`)
    }

    // Success - reset failed counter
    cookieStore.delete('sec_login_tracker')
  } catch (err) {
    if (!isDemoUser) {
      return redirect('/login?message=Unable%20to%20connect%20to%20auth%20service')
    }
    // If demo user succeeded despite error, clear tracker
    cookieStore.delete('sec_login_tracker')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
