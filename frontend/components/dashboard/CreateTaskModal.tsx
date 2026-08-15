"use client";

import { FormEvent, useState } from "react";
import { X, Plus } from "lucide-react";

import type {
  TaskPayload,
  TaskStatus,
} from "@/types/task";

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (data: TaskPayload) => Promise<void>;
}

export default function CreateTaskModal({
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [status, setStatus] =
    useState<TaskStatus>("pending");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onCreate({
        title,
        description,
        status,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create task."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17162f]/45 px-4 backdrop-blur-md">

      <div className="glass-strong w-full max-w-lg rounded-[28px] p-6 shadow-2xl sm:p-8">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create new task
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Add something you want to accomplish.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Task title
            </label>

            <input
              required
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Complete portfolio"
              className="w-full rounded-2xl border border-[#c9c6f4] bg-white/95 px-4 py-3.5 text-sm outline-none focus:border-[#7568e8] focus:ring-4 focus:ring-[#7568e8]/12"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your task..."
              className="w-full resize-none rounded-2xl border border-[#c9c6f4] bg-white/95 px-4 py-3.5 text-sm outline-none focus:border-[#7568e8] focus:ring-4 focus:ring-[#7568e8]/12"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as TaskStatus
                )
              }
              className="w-full rounded-2xl border border-[#c9c6f4] bg-white/95 px-4 py-3.5 text-sm outline-none focus:border-[#7568e8] focus:ring-4 focus:ring-[#7568e8]/12"
            >
              <option value="pending">
                Pending
              </option>
              <option value="in_progress">
                In Progress
              </option>
              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6574df] to-[#7a68e8] py-3.5 font-semibold text-white shadow-lg shadow-[#7568e8]/25 hover:from-[#5968d2] hover:to-[#6f5dde] disabled:opacity-60"
          >
            <Plus size={18} />
            {loading
              ? "Creating..."
              : "Create task"}
          </button>
        </form>
      </div>
    </div>
  );
}