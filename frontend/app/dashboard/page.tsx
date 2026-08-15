"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import TaskFilters from "@/components/dashboard/TaskFilters";
import TaskCard from "@/components/dashboard/TaskCard";
import CreateTaskModal from "@/components/dashboard/CreateTaskModal";
import EditTaskModal from "@/components/dashboard/EditTaskModal";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/lib/api";

import type {
  Task,
  TaskPayload,
  TaskStatus,
} from "@/types/task";

import type { User } from "@/types/user";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<TaskStatus | "">("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    router.replace("/");
  }, [router]);

  const loadTasks = useCallback(async () => {
    try {
      setError("");

      const data = await getTasks(
        search,
        status
      );

      setTasks(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load tasks.";

      if (
        message.toLowerCase().includes(
          "credentials"
        ) ||
        message.toLowerCase().includes(
          "token"
        )
      ) {
        logout();
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [search, status, logout]);

  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    const savedUser =
      localStorage.getItem("user");

    if (!token || !savedUser) {
      router.replace("/");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      logout();
    }
  }, [router, logout]);

  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(() => {
      loadTasks();
    }, 250);

    return () => clearTimeout(timeout);
  }, [user, loadTasks]);

  async function handleCreateTask(
    data: TaskPayload
  ) {
    const newTask = await createTask(data);

    setTasks((current) => [
      newTask,
      ...current,
    ]);

    setShowCreateModal(false);
  }

  async function handleUpdateTask(
    data: TaskPayload
  ) {
    if (!editingTask) return;

    const updated = await updateTask(
      editingTask.id,
      data
    );

    setTasks((current) =>
      current.map((task) =>
        task.id === updated.id
          ? updated
          : task
      )
    );

    setEditingTask(null);
  }

  async function handleDeleteTask(
    task: Task
  ) {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteTask(task.id);

      setTasks((current) =>
        current.filter(
          (item) => item.id !== task.id
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete task."
      );
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f2ff]">
        <div className="text-sm font-medium text-slate-500">
          Loading workspace...
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#f1f2ff]">

      <div className="flex min-h-screen">

        <Sidebar
          userName={user.name}
          onCreateTask={() =>
            setShowCreateModal(true)
          }
          onLogout={logout}
        />

        <section className="min-w-0 flex-1">

          <Header
            user={user}
            onCreateTask={() =>
              setShowCreateModal(true)
            }
            onLogout={logout}
          />

          <div className="px-5 pb-10 sm:px-8 lg:px-10">

            {/* HERO */}
            <div className="relative mb-6 overflow-hidden rounded-[28px] glass relative p-7 text-slate-900 shadow-xl shadow-[#7568e8]/10 sm:p-9">

              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#8b7cf2]/16 blur-3xl" />

              <div className="absolute bottom-0 right-32 h-32 w-32 rounded-full bg-[#6e8ef2]/12 blur-3xl" />

              <div className="relative">
                <p className="mb-2 text-sm font-medium text-[#6a63d8]">
                  Your productivity overview
                </p>

                <h1 className="max-w-xl text-2xl font-bold sm:text-3xl">
                  Everything you need,
                  <span className="text-[#665bd4]">
                    {" "}in one place.
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#7f88aa]">
                  Stay focused, manage your priorities,
                  and keep track of your progress.
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">

              <div className="glass rounded-[22px] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7f88aa]">
                      Total tasks
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {tasks.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeedff] text-[#655bd4]">
                    <ListTodo size={21} />
                  </div>
                </div>
              </div>

              <div className="glass rounded-[22px] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7f88aa]">
                      In progress
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {inProgressCount}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeecff] text-[#6d61df]">
                    <Clock3 size={21} />
                  </div>
                </div>
              </div>

              <div className="glass rounded-[22px] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7f88aa]">
                      Completed
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {completedCount}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={21} />
                  </div>
                </div>
              </div>

            </div>

            {/* FILTERS */}
            <div className="mb-6">
              <TaskFilters
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* TASK HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your tasks
                </h2>

                <p className="mt-1 text-sm text-[#7f88aa]">
                  {pendingCount} pending
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="hidden rounded-xl border border border-[#d8d5f7] bg-white/85 px-4 py-2 text-sm font-semibold text-[#5f6687] transition hover:border-[#7568e8] hover:text-[#6258d2] sm:block"
              >
                + Add task
              </button>
            </div>

            {/* TASKS */}
            {loading ? (
              <div className="glass rounded-[24px] p-10 text-center">
                <p className="text-sm text-[#7f88aa]">
                  Loading your tasks...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass rounded-[24px] p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eeedff] text-[#655bd4]">
                  <ListTodo size={25} />
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  No tasks found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7f88aa]">
                  Create your first task or change
                  your search filters.
                </p>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#6574df] to-[#7a68e8] px-5 py-2.5 text-sm font-semibold text-white hover:from-[#5968d2] hover:to-[#6f5dde]"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}

          </div>
        </section>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreate={handleCreateTask}
        />
      )}

      {/* EDIT MODAL */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() =>
            setEditingTask(null)
          }
          onUpdate={handleUpdateTask}
        />
      )}

    </main>
  );
}