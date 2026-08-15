"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Task, TaskStatus } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "border border-[#d8d5f7] bg-[#f3f2ff] text-[#66618e]",
    icon: <Circle size={14} />,
  },
  in_progress: {
    label: "In Progress",
    className:
      "border border-[#d8dcff] bg-[#eef0ff] text-[#5f70d8]",
    icon: <Clock3 size={14} />,
  },
  completed: {
    label: "Completed",
    className:
      "border border-[#cfeee4] bg-[#eefaf6] text-[#2d9b7d]",
    icon: <CheckCircle2 size={14} />,
  },
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const config = statusConfig[task.status];

  return (
    <article className="group glass relative rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">

      <div className="flex items-start justify-between gap-4">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
        >
          {config.icon}
          {config.label}
        </div>

        <div className="relative">
          <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <MoreHorizontal size={18} />
          </button>

          <div className="invisible absolute right-0 top-9 z-20 w-32 rounded-xl border border-slate-100 bg-white p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(task)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <h3 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900">
        {task.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {task.description}
      </p>

      <div className="mt-6 border-t border-[#e3e0f7] pt-4">
        <p className="text-xs font-medium text-slate-400">
          Task #{task.id}
        </p>
      </div>
    </article>
  );
}