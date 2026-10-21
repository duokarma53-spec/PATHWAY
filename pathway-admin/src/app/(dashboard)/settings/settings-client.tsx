"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminProfile } from "@/lib/profile/use-admin-profile";
import {
  User,
  Mail,
  Shield,
  Phone,
  Building2,
  KeyRound,
  Lock,
  Unlock,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
  Globe2,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SETTINGS_PIN = "1010";

// ── PIN Gate ─────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = React.useState(["", "", "", ""]);
  const [error, setError] = React.useState(false);
  const [shaking, setShaking] = React.useState(false);
  const refs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...pin];
    next[index] = digit;
    setPin(next);
    setError(false);

    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (digit && index === 3) {
      const fullPin = [...next].join("");
      if (fullPin === SETTINGS_PIN) {
        onUnlock();
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin(["", "", "", ""]);
          refs[0].current?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join("");
    if (fullPin === SETTINGS_PIN) {
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setPin(["", "", "", ""]);
        refs[0].current?.focus();
      }, 600);
    }
  };

  const handleDigitPress = (digit: string) => {
    const firstEmpty = pin.findIndex((val) => val === "");
    const targetIdx = firstEmpty !== -1 ? firstEmpty : 3;
    const next = [...pin];
    next[targetIdx] = digit;
    setPin(next);
    setError(false);

    if (targetIdx < 3) {
      refs[targetIdx + 1].current?.focus();
    }

    if (targetIdx === 3) {
      const fullPin = next.join("");
      if (fullPin === SETTINGS_PIN) {
        onUnlock();
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin(["", "", "", ""]);
          refs[0].current?.focus();
        }, 600);
      }
    }
  };

  const handleBackspace = () => {
    const lastFilled = [...pin].reverse().findIndex((val) => val !== "");
    if (lastFilled !== -1) {
      const idx = 3 - lastFilled;
      const next = [...pin];
      next[idx] = "";
      setPin(next);
      refs[idx].current?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-3 sm:px-4 w-full">
      <div className="w-full max-w-sm sm:max-w-md p-5 sm:p-8 rounded-3xl bg-[#14100D]/95 border border-white/[0.08] backdrop-blur-2xl shadow-2xl flex flex-col items-center gap-5 sm:gap-6 relative overflow-hidden box-border">
        {/* Subtle orange accent glow at top */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="flex flex-col items-center gap-3 text-center w-full">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-[#271A12] border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
            <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="px-1">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Administrative Clearance
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed mx-auto">
              Enter the 4-digit system access PIN to unlock sensitive account credentials and administrative controls.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <div
            className={`flex gap-2 sm:gap-3.5 justify-center items-center max-w-full transition-transform ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
            style={shaking ? { animation: "shake 0.5s ease-in-out" } : {}}
          >
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                autoFocus={i === 0}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 text-center text-xl sm:text-2xl font-bold rounded-xl sm:rounded-2xl border-2 bg-black/60 outline-none transition-all font-mono
                  ${
                    error
                      ? "border-destructive text-destructive bg-destructive/10"
                      : digit
                      ? "border-primary text-primary shadow-sm shadow-primary/20"
                      : "border-white/[0.12] text-foreground focus:border-primary/70 focus:bg-black/80"
                  }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold animate-in fade-in">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Incorrect PIN. Please re-enter credentials.</span>
            </div>
          )}

          {/* Luxury Obsidian Keypad */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] pt-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigitPress(num)}
                className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-primary/20 border border-white/[0.08] text-foreground font-mono font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setPin(["", "", "", ""]); setError(false); refs[0].current?.focus(); }}
              className="h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-muted-foreground text-xs font-semibold transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigitPress("0")}
              className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-primary/20 border border-white/[0.08] text-foreground font-mono font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-muted-foreground text-xs font-semibold transition-all flex items-center justify-center"
              title="Backspace"
            >
              ⌫
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-1"
            disabled={pin.some((d) => !d)}
          >
            Unlock Security Settings
          </Button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setPin(["1", "0", "1", "0"]);
                onUnlock();
              }}
              className="text-[11px] text-primary/75 hover:text-primary hover:underline font-mono transition-colors"
            >
              Authorize with clearance (1010)
            </button>
          </div>
        </form>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-8px); }
            40%       { transform: translateX(8px); }
            60%       { transform: translateX(-6px); }
            80%       { transform: translateX(6px); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── Main Settings View ────────────────────────────────────────────────────────
export function SettingsClientView() {
  const { profile, updateProfile } = useAdminProfile();
  const [unlocked, setUnlocked] = React.useState(false);

  const [formState, setFormState] = React.useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    phone: profile.phone,
    company: profile.company,
  });

  const [passwordState, setPasswordState] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

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
      toast.error("Passwords do not match. Please verify.");
      return;
    }
    if (passwordState.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const supabase = createClient();
      // Updates the authenticated user's password directly in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordState.newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to update password. Please try again.");
      } else {
        toast.success("Password updated successfully in Supabase Auth!", {
          description: "Your new password is now active. Use it on your next login.",
        });
        setPasswordState({ newPassword: "", confirmPassword: "" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error updating password";
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Show PIN gate until unlocked
  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Account &amp; System Settings
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/25 inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Clearance Granted
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your personal administrative profile, security policies, and consultancy brand identity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUnlocked(false)}
            className="rounded-xl border-white/10 hover:border-white/20 text-xs flex items-center gap-1.5 h-9 text-muted-foreground hover:text-foreground"
            title="Lock settings clearance"
          >
            <Lock className="h-3.5 w-3.5 text-primary" /> Lock Clearance
          </Button>

          {/* Live Profile Badge */}
          <div className="flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-[#14100D]/90 border border-white/[0.08] shadow-sm">
            <div className="h-8 w-8 rounded-xl bg-[#271A12] border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="border-white/[0.08] bg-[#14100D]/85 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Administrative Profile
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Alterations update your dashboard greeting, topbar identification, and staff signatures.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                  Full Name / Display Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground focus:border-primary/50"
                    placeholder="e.g. Hatim Suttar"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground focus:border-primary/50"
                    placeholder="e.g. hatim@pathwayeducation.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-semibold text-foreground">
                  Administrative Role
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="role"
                    name="role"
                    value={formState.role}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground focus:border-primary/50"
                    placeholder="e.g. SUPER ADMIN, DIRECTOR"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground focus:border-primary/50"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold text-foreground">
                  Consultancy Brand
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="pl-9 h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground focus:border-primary/50"
                    placeholder="e.g. Pathway Education Consultancy"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-white/[0.06]">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs px-5 h-10 shadow-md shadow-primary/20 flex items-center gap-2"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? "Saving Alterations..." : "Save Profile Alterations"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card className="border-white/[0.08] bg-[#14100D]/85 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Security &amp; Authentication
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Directly updates your encrypted Supabase Auth credentials. Use the updated password on your next login.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={passwordState.newPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, newPassword: e.target.value })
                    }
                    className="h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground pr-10 focus:border-primary/50"
                    placeholder="Enter at least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={passwordState.confirmPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                    }
                    className="h-10 rounded-xl text-xs bg-black/40 border-white/[0.08] text-foreground pr-10 focus:border-primary/50"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password match indicator */}
            {passwordState.newPassword && passwordState.confirmPassword && (
              <p
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  passwordState.newPassword === passwordState.confirmPassword
                    ? "text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {passwordState.newPassword === passwordState.confirmPassword ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" /> Passwords match
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" /> Passwords do not match
                  </>
                )}
              </p>
            )}

            <div className="pt-3 flex justify-end border-t border-white/[0.06]">
              <Button
                type="submit"
                disabled={
                  isSavingPassword ||
                  !passwordState.newPassword ||
                  passwordState.newPassword !== passwordState.confirmPassword
                }
                variant="outline"
                className="font-semibold rounded-xl text-xs px-5 h-10 border-white/10 hover:border-white/20 bg-white/[0.02] text-foreground hover:bg-white/[0.05]"
              >
                {isSavingPassword ? "Updating Password in Supabase..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
