"use client";

import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";

interface SidebarProps {
  userName: string;
  onCreateTask: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  userName,
  onCreateTask,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 p-5 lg:block">
      <div className="glass sticky top-5 flex h-[calc(100vh-40px)] flex-col rounded-[28px] p-5">

        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6978e4] to-[#7968e8] text-white shadow-lg shadow-[#7568e8]/25">
            <CheckSquare size={21} />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-400">
              Personal workspace
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="flex items-center gap-3 rounded-2xl border border-[#d8d5f7] bg-[#f1f0ff] px-4 py-3 text-sm font-semibold text-[#635bd1]">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-500">
            <UserRound size={18} />
            My Profile
          </div>
        </div>

        <button
          onClick={onCreateTask}
          className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6574df] to-[#7a68e8] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7568e8]/25 transition hover:from-[#5968d2] hover:to-[#6f5dde]"
        >
          <Plus size={18} />
          Create new task
        </button>

        <div className="mt-auto border-t border-[#dddaf5] pt-5">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#e0def6] bg-[#f8f8ff] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe9ff] font-bold text-[#665bd4]">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>
              <p className="text-xs text-slate-400">
                Personal account
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}