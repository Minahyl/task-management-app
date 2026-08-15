"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type { TaskStatus } from "@/types/task";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
}

export default function TaskFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="glass rounded-[24px] p-3">
      <div className="flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search your tasks..."
            className="w-full rounded-2xl border border-[#e0def6] bg-[#f8f8ff] py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:border-[#7568e8] focus:ring-4 focus:ring-[#7568e8]/10"
          />
        </div>

        <div className="relative md:w-52">
          <SlidersHorizontal
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as TaskStatus | ""
              )
            }
            className="w-full appearance-none rounded-2xl border border-[#e0def6] bg-[#f8f8ff] py-3.5 pl-11 pr-4 text-sm font-medium text-slate-600 outline-none transition focus:bg-white focus:border-[#7568e8] focus:ring-4 focus:ring-[#7568e8]/10"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}