"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@web/hooks/use-auth";
import { type RegisterFormData, registerSchema } from "@web/schemas/auth-schemas";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterFormData) => {
    registerUser.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        // Após criar a conta, autentica automaticamente e segue para a home
        onSuccess: () => {
          login.mutate(
            { email: data.email, password: data.password },
            { onSuccess: () => router.push("/") },
          );
        },
      },
    );
  };

  const serverError = registerUser.error?.message ?? login.error?.message;
  const isPending = registerUser.isPending || login.isPending;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-500 text-sm mt-1">Junte-se ao Evosport</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
              placeholder="Seu nome"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
              placeholder="voce@exemplo.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
              placeholder="Mínimo de 6 caracteres"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
              placeholder="Repita a senha"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {isPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
