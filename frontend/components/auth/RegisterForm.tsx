"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { registerUser } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
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

    if (password.length < 6) {
      setError(
        "Password should be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbff]">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#8b7cf2]/18 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <button
            onClick={() => router.push("/")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to login
          </button>

          <div className="glass gradient-border rounded-[32px] p-8 sm:p-10">

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6978e4] to-[#7968e8] text-white shadow-lg shadow-[#7568e8]/25">
                <UserRound size={22} />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start organizing your work with TaskFlow.
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
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6574df] to-[#7a68e8] py-3.5 font-semibold text-white shadow-lg shadow-[#7568e8]/25 transition hover:from-[#5968d2] hover:to-[#6f5dde] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}