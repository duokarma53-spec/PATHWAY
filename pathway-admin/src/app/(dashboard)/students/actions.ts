'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const studentSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  current_institution: z.string().optional(),
  grade_level: z.string().optional(),
  notes: z.string().optional(),
})

export async function createStudent(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    country: formData.get('country'),
    city: formData.get('city'),
    current_institution: formData.get('current_institution'),
    grade_level: formData.get('grade_level'),
    notes: formData.get('notes'),
  }

  const validatedFields = studentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Student.',
    }
  }

  const { error } = await supabase
    .from('students')
    .insert([validatedFields.data])

  if (error) {
    return {
      message: 'Database Error: Failed to Create Student. ' + error.message,
    }
  }

  revalidatePath('/students')
  redirect('/students')
}
