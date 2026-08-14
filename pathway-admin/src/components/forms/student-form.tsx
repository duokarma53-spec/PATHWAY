"use client"

import { useActionState } from "react"
import { createStudent } from "@/app/(dashboard)/students/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

const initialState = {
  message: null,
  errors: {},
}

export function StudentForm() {
  const [state, formAction, pending] = useActionState(createStudent, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded">
          {state.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" name="first_name" required placeholder="John" />
          {state?.errors?.first_name && (
            <p className="text-sm text-destructive">{state.errors.first_name[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" name="last_name" required placeholder="Doe" />
          {state?.errors?.last_name && (
            <p className="text-sm text-destructive">{state.errors.last_name[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          {state?.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="India" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="Mumbai" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current_institution">Current Institution</Label>
          <Input id="current_institution" name="current_institution" placeholder="University of Mumbai" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="grade_level">Grade Level / Year</Label>
          <Input id="grade_level" name="grade_level" placeholder="Undergraduate Year 3" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Initial Notes</Label>
        <textarea
          id="notes"
          name="notes"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Any initial notes about the student's goals or requirements..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Student
        </Button>
      </div>
    </form>
  )
}
