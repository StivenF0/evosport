"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@web/components/admin/FormField";
import { Modal } from "@web/components/admin/Modal";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useEvents } from "@web/hooks/use-event";
import { useCreateMatch, useDeleteMatch, useMatches, useUpdateMatch } from "@web/hooks/use-match";
import { useTeams } from "@web/hooks/use-team";
import { useVenues } from "@web/hooks/use-venue";
import {
  type AdminMatchFormData,
  type AdminMatchFormInput,
  adminMatchSchema,
} from "@web/schemas/admin-schemas";
import type { Match } from "@web/types/api-types";
import { Pencil, Plus, Swords, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const toDateTimeInput = (iso: string) => iso.slice(0, 16);

export default function AdminMatchesPage() {
  const { data: matches, isLoading, isError, error } = useMatches();
  const { data: events } = useEvents();
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();

  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Match | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminMatchFormInput, unknown, AdminMatchFormData>({
    resolver: zodResolver(adminMatchSchema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      eventId: events?.[0]?.id,
      homeTeamId: undefined,
      awayTeamId: undefined,
      stadiumId: undefined,
      date: "",
      status: "agendado",
      homeScore: null,
      awayScore: null,
    });
    setOpen(true);
  };

  const openEdit = (match: Match) => {
    setEditing(match);
    reset({
      eventId: match.eventId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stadiumId: match.stadiumId,
      date: toDateTimeInput(match.date),
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    });
    setOpen(true);
  };

  const onSubmit = (data: AdminMatchFormData) => {
    const payload = { ...data, date: new Date(data.date) };
    const onDone = () => setOpen(false);
    if (editing) {
      updateMatch.mutate({ id: editing.id, data: payload }, { onSuccess: onDone });
    } else {
      createMatch.mutate(payload, { onSuccess: onDone });
    }
  };

  const handleDelete = (match: Match) => {
    if (confirm("Excluir esta partida?")) deleteMatch.mutate(match.id);
  };

  const isSaving = createMatch.isPending || updateMatch.isPending;
  const saveError = createMatch.error?.message ?? updateMatch.error?.message;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Partidas</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova partida
        </button>
      </header>

      {isLoading && <LoadingSpinner message="Carregando partidas..." />}
      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!matches || matches.length === 0) && (
        <EmptyState
          title="Nenhuma partida"
          message="Cadastre a primeira partida clicando em 'Nova partida'."
          icon={<Swords className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && matches && matches.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between px-5 py-3 gap-4">
              <div className="min-w-0">
                <span className="font-medium text-gray-800">
                  {match.homeTeam?.name} <span className="text-gray-400">x</span>{" "}
                  {match.awayTeam?.name}
                </span>
                <span className="block text-xs text-gray-400">{match.formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(match)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                  aria-label="Editar partida"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(match)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Excluir partida"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? "Editar partida" : "Nova partida"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Evento" htmlFor="eventId" error={errors.eventId?.message}>
            <select id="eventId" className={inputClass} {...register("eventId")}>
              <option value="">Selecione...</option>
              {events?.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Time da casa" htmlFor="homeTeamId" error={errors.homeTeamId?.message}>
              <select id="homeTeamId" className={inputClass} {...register("homeTeamId")}>
                <option value="">Selecione...</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Visitante" htmlFor="awayTeamId" error={errors.awayTeamId?.message}>
              <select id="awayTeamId" className={inputClass} {...register("awayTeamId")}>
                <option value="">Selecione...</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Sede" htmlFor="stadiumId" error={errors.stadiumId?.message}>
            <select id="stadiumId" className={inputClass} {...register("stadiumId")}>
              <option value="">Selecione...</option>
              {venues?.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Data e hora" htmlFor="date" error={errors.date?.message}>
            <input id="date" type="datetime-local" className={inputClass} {...register("date")} />
          </FormField>

          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <select id="status" className={inputClass} {...register("status")}>
              <option value="agendado">Agendado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="encerrado">Encerrado</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Placar casa" htmlFor="homeScore" error={errors.homeScore?.message}>
              <input
                id="homeScore"
                type="number"
                className={inputClass}
                {...register("homeScore")}
              />
            </FormField>
            <FormField
              label="Placar visitante"
              htmlFor="awayScore"
              error={errors.awayScore?.message}
            >
              <input
                id="awayScore"
                type="number"
                className={inputClass}
                {...register("awayScore")}
              />
            </FormField>
          </div>

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
