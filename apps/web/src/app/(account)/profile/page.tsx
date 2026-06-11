"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@web/hooks/use-auth";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter ao menos 2 caracteres"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "" },
  });

  // Limpa o estado de sucesso quando o nome do usuário muda
  useEffect(() => {
    if (updateProfile.isSuccess) reset({ name: user?.name ?? "" });
  }, [updateProfile.isSuccess, user?.name, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data.name);
  };

  const initial = user?.name.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meu perfil</h1>
        <p className="mt-1 text-gray-500 text-sm">Gerencie suas informações pessoais.</p>
      </header>

      <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <span className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5"
        noValidate
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {updateProfile.isError && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
            {updateProfile.error.message}
          </div>
        )}

        {updateProfile.isSuccess && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700 inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Nome atualizado com sucesso.
          </div>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending || !isDirty}
          className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {updateProfile.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
