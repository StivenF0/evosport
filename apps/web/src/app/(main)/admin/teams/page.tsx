"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@web/components/admin/FormField";
import { Modal } from "@web/components/admin/Modal";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useCreateTeam, useDeleteTeam, useTeams, useUpdateTeam } from "@web/hooks/use-team";
import { type AdminTeamFormData, adminTeamSchema } from "@web/schemas/admin-schemas";
import type { Team } from "@web/types/api-types";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminTeamsPage() {
  const { data: teams, isLoading, isError, error } = useTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminTeamFormData>({ resolver: zodResolver(adminTeamSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", flagUrl: "" });
    setOpen(true);
  };

  const openEdit = (team: Team) => {
    setEditing(team);
    reset({ name: team.name, flagUrl: team.flagUrl ?? "" });
    setOpen(true);
  };

  const onSubmit = (data: AdminTeamFormData) => {
    const payload = { name: data.name, flagUrl: data.flagUrl || null };
    const onDone = () => setOpen(false);
    if (editing) {
      updateTeam.mutate({ id: editing.id, data: payload }, { onSuccess: onDone });
    } else {
      createTeam.mutate(payload, { onSuccess: onDone });
    }
  };

  const handleDelete = (team: Team) => {
    if (confirm(`Excluir o time "${team.name}"?`)) deleteTeam.mutate(team.id);
  };

  const isSaving = createTeam.isPending || updateTeam.isPending;
  const saveError = createTeam.error?.message ?? updateTeam.error?.message;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Times</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo time
        </button>
      </header>

      {isLoading && <LoadingSpinner message="Carregando times..." />}
      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!teams || teams.length === 0) && (
        <EmptyState
          title="Nenhum time"
          message="Cadastre o primeiro time clicando em 'Novo time'."
          icon={<Users className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && teams && teams.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between px-5 py-3">
              <span className="font-medium text-gray-800">{team.name}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(team)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                  aria-label={`Editar ${team.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(team)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Excluir ${team.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? "Editar time" : "Novo time"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <input id="name" type="text" className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="URL da bandeira" htmlFor="flagUrl" error={errors.flagUrl?.message}>
            <input id="flagUrl" type="text" className={inputClass} {...register("flagUrl")} />
          </FormField>

          {saveError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="self-end bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
