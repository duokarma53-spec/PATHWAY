"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminProfile } from "@/lib/profile/use-admin-profile";
import { User, Mail, Shield, Phone, Building2, KeyRound, Bell, CheckCircle2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SettingsClientView() {
  const { profile, updateProfile, initials } = useAdminProfile();

  const [formState, setFormState] = React.useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
    company: profile.company,
  });

  const [passwordState, setPasswordState] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);

  // Sync form state when profile finishes initial loading
  React.useEffect(() => {
    setFormState({
      name: profile.name,
      email: profile.email,
      role: profile.role,
      phone: profile.phone,
      company: profile.company,
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(formState);
      toast.success("Profile alterations saved successfully!", {
        description: `Name updated to "${formState.name}" and email to "${formState.email}".`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error("New passwords do not match. Please verify.");
      return;
    }
    if (passwordState.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwordState.newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        setPasswordState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Account & System Settings
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your personal administrative profile, contact details, security and preferences.
          </p>
        </div>

        {/* Live Profile Badge */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-2xl bg-card border border-border/70 shadow-sm">
          <div className="h-11 w-11 rounded-full bg-white border border-[#D4AF37]/70 p-0.5 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/images/logo.png"
              alt={profile.name}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate max-w-[160px]">
              {profile.name}
            </span>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="border-border/70 bg-card/90 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Administrative Profile</CardTitle>
              <CardDescription className="text-xs">
                Changes made here immediately update your dashboard greeting and topbar credentials.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Full Name / Display Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                    placeholder="e.g. Hatim Suttar"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                    placeholder="e.g. hatim@pathwayeducation.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-semibold">
                  Administrative Role
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="role"
                    name="role"
                    value={formState.role}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                    placeholder="e.g. SUPER ADMIN, DIRECTOR"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold">
                  Consultancy Brand
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                    placeholder="e.g. Pathway Education Consultancy"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs px-5 shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? "Saving Alterations..." : "Save Profile Alterations"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card className="border-border/70 bg-card/90 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Security & Password</CardTitle>
              <CardDescription className="text-xs">
                Update your administrative login credentials.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  className="h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                  placeholder="Enter at least 6 characters"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  className="h-10 rounded-xl text-xs bg-muted/20 border-border/60"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSavingPassword || !passwordState.newPassword}
                variant="outline"
                className="font-semibold rounded-xl text-xs px-5 border-border/70"
              >
                {isSavingPassword ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
