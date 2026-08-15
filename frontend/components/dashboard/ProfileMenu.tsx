"use client";

import { LogOut, UserRound } from "lucide-react";
import type { User } from "@/types/user";

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
}

export default function ProfileMenu({
  user,
  onLogout,
}: ProfileMenuProps) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-3 rounded-2xl border border-[#d8d5f7] bg-white/85 px-2 py-2 pr-4 shadow-sm backdrop-blur transition hover:bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ebe9ff] font-bold text-[#665bd4]">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
            {user.name}
          </p>
          <p className="max-w-[120px] truncate text-xs text-slate-400">
            {user.email}
          </p>
        </div>
      </button>

      <div className="invisible absolute right-0 top-[calc(100%+8px)] z-30 w-56 translate-y-2 rounded-2xl border border-[#d8d5f7] bg-[#fcfcff] p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

        <div className="flex items-center gap-3 border-b border-slate-100 p-3">
          <UserRound size={17} className="text-blue-600" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}