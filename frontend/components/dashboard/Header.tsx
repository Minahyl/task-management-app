"use client";

import {
  Menu,
  Plus,
  Sparkles,
} from "lucide-react";

import type { User } from "@/types/user";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  user: User;
  onCreateTask: () => void;
  onLogout: () => void;
}

export default function Header({
  user,
  onCreateTask,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">

      <div className="flex items-center gap-3">
        <button className="rounded-xl glass p-2.5 text-slate-500 shadow-sm lg:hidden">
          <Menu size={20} />
        </button>

        <div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-blue-600 sm:flex">
            <Sparkles size={14} />
            Your personal workspace
          </div>

          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Good to see you, {user.name.split(" ")[0]}.
          </h2>

          <p className="mt-1 hidden text-sm text-slate-400 sm:block">
            Let&apos;s get things done today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onCreateTask}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6574df] to-[#7a68e8] px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#7568e8]/25 transition hover:from-[#5968d2] hover:to-[#6f5dde] sm:px-4"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">
            New task
          </span>
        </button>

        <ProfileMenu
          user={user}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}