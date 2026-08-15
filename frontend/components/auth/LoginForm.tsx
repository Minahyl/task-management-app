"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

import { loginUser } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbff]">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#8b7cf2]/18 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <section className="hidden lg:block">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
              <Sparkles size={16} />
              Smart Task Management
            </div>

            <h1 className="max-w-xl text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
              Organize your work.
              <span className="gradient-text block">
                Own your day.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">
              Manage your tasks with a clean, focused workspace
              designed to keep everything under control.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Create and organize your tasks",
                "Track progress with smart statuses",
                "Keep your workspace private",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-600"
                >
                  <CheckCircle2
                    size={20}
                    className="text-blue-600"
                  />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="mx-auto w-full max-w-md">
            <div className="glass gradient-border rounded-[32px] p-8 sm:p-10">

              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <LockKeyhole size={22} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to continue to your workspace.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                New to TaskFlow?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}