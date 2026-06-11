"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@web/components/admin/FormField";
import { Modal } from "@web/components/admin/Modal";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from "@web/hooks/use-event";
import { type AdminEventFormData, adminEventSchema } from "@web/schemas/admin-schemas";
import type { Event } from "@web/types/api-types";
import { CalendarRange, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const toDateInput = (iso: string) => iso.slice(0, 10);

export default function AdminEventsPage() {
  const { data: events, isLoading, isError, error } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminEventFormData>({ resolver: zodResolver(adminEventSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", description: "", startDate: "", endDate: "", logoUrl: "" });
    setOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditing(event);
    reset({
      name: event.name,
      description: event.description ?? "",
      startDate: toDateInput(event.startDate),
      endDate: toDateInput(event.endDate),
      logoUrl: event.logoUrl ?? "",
    });
    setOpen(true);
  };

  const onSubmit = (data: AdminEventFormData) => {
    const payload = {
      name: data.name,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      logoUrl: data.logoUrl || null,
    };
    const onDone = () => setOpen(false);
    if (editing) {
      updateEvent.mutate({ id: editing.id, data: payload }, { onSuccess: onDone });
    } else {
      createEvent.mutate(payload, { onSuccess: onDone });
    }
  };

  const handleDelete = (event: Event) => {
    if (confirm(`Excluir o evento "${event.name}"?`)) deleteEvent.mutate(event.id);
  };

  const isSaving = createEvent.isPending || updateEvent.isPending;
  const saveError = createEvent.error?.message ?? updateEvent.error?.message;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Eventos</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo evento
        </button>
      </header>

      {isLoading && <LoadingSpinner message="Carregando eventos..." />}
      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!events || events.length === 0) && (
        <EmptyState
          title="Nenhum evento"
          message="Cadastre o primeiro evento clicando em 'Novo evento'."
          icon={<CalendarRange className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-5 py-3">
              <span className="font-medium text-gray-800">{event.name}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(event)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                  aria-label={`Editar ${event.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Excluir ${event.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? "Editar evento" : "Novo evento"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <input id="name" type="text" className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="Descrição" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              rows={3}
              className={inputClass}
              {...register("description")}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Início" htmlFor="startDate" error={errors.startDate?.message}>
              <input id="startDate" type="date" className={inputClass} {...register("startDate")} />
            </FormField>
            <FormField label="Término" htmlFor="endDate" error={errors.endDate?.message}>
              <input id="endDate" type="date" className={inputClass} {...register("endDate")} />
            </FormField>
          </div>
          <FormField label="URL do logo" htmlFor="logoUrl" error={errors.logoUrl?.message}>
            <input id="logoUrl" type="text" className={inputClass} {...register("logoUrl")} />
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
