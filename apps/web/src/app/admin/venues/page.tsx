"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClass } from "@web/components/admin/FormField";
import { Modal } from "@web/components/admin/Modal";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useCreateVenue, useDeleteVenue, useUpdateVenue, useVenues } from "@web/hooks/use-venue";
import {
  type AdminVenueFormData,
  type AdminVenueFormInput,
  adminVenueSchema,
} from "@web/schemas/admin-schemas";
import type { Venue } from "@web/types/api-types";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminVenuesPage() {
  const { data: venues, isLoading, isError, error } = useVenues();
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Venue | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminVenueFormInput, unknown, AdminVenueFormData>({
    resolver: zodResolver(adminVenueSchema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", city: "", capacity: null, latitude: null, longitude: null });
    setOpen(true);
  };

  const openEdit = (venue: Venue) => {
    setEditing(venue);
    reset({
      name: venue.name,
      city: venue.city,
      capacity: venue.capacity,
      latitude: venue.latitude,
      longitude: venue.longitude,
    });
    setOpen(true);
  };

  const onSubmit = (data: AdminVenueFormData) => {
    const onDone = () => setOpen(false);
    if (editing) {
      updateVenue.mutate({ id: editing.id, data }, { onSuccess: onDone });
    } else {
      createVenue.mutate(data, { onSuccess: onDone });
    }
  };

  const handleDelete = (venue: Venue) => {
    if (confirm(`Excluir a sede "${venue.name}"?`)) deleteVenue.mutate(venue.id);
  };

  const isSaving = createVenue.isPending || updateVenue.isPending;
  const saveError = createVenue.error?.message ?? updateVenue.error?.message;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sedes</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova sede
        </button>
      </header>

      {isLoading && <LoadingSpinner message="Carregando sedes..." />}
      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!venues || venues.length === 0) && (
        <EmptyState
          title="Nenhuma sede"
          message="Cadastre a primeira sede clicando em 'Nova sede'."
          icon={<MapPin className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && venues && venues.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <span className="font-medium text-gray-800">{venue.name}</span>
                <span className="text-sm text-gray-400 ml-2">{venue.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(venue)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                  aria-label={`Editar ${venue.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(venue)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Excluir ${venue.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? "Editar sede" : "Nova sede"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <input id="name" type="text" className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="Cidade" htmlFor="city" error={errors.city?.message}>
            <input id="city" type="text" className={inputClass} {...register("city")} />
          </FormField>
          <FormField label="Capacidade" htmlFor="capacity" error={errors.capacity?.message}>
            <input id="capacity" type="number" className={inputClass} {...register("capacity")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Latitude" htmlFor="latitude" error={errors.latitude?.message}>
              <input
                id="latitude"
                type="number"
                step="any"
                className={inputClass}
                {...register("latitude")}
              />
            </FormField>
            <FormField label="Longitude" htmlFor="longitude" error={errors.longitude?.message}>
              <input
                id="longitude"
                type="number"
                step="any"
                className={inputClass}
                {...register("longitude")}
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
