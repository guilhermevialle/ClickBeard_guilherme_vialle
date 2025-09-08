import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideMail,
  LucideMoveLeft,
  LucideUser,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { useUserSession } from "../../hooks/use-user-session";
import PageLayout from "../../lib/components/page-layout";
import { register as registerUser } from "../../services/api/auth";

const registerSchema = z
  .object({
    name: z.string().min(1, "O nome deve ter no mínimo 1 caracteres"),
    email: z.email("Email inválido").min(1, "Email obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { session, saveSession } = useUserSession();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormInputs) =>
      registerUser({ name, email, password }),
    onSuccess: (data) => {
      saveSession(data);
      alert("Registrado com sucesso!");
      navigate("/schedule");
    },
  });

  const onSubmit = (data: RegisterFormInputs) => mutation.mutate(data);

  useEffect(() => {
    if (session) navigate("/schedule");
  }, [session, navigate]);

  return (
    !session && (
      <main className="h-screen w-full bg-[#0d0d0d]">
        <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
        <PageLayout className="z-10 flex h-full flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="z-10 aspect-[9/11] w-[480px] rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-neutral-300/10 px-10 pt-8 pb-5 backdrop-blur-sm"
          >
            <Link to="/">
              <LucideMoveLeft className="size-6 text-neutral-300 hover:opacity-85" />
            </Link>

            <h1 className="mt-3 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl leading-14 font-semibold tracking-tighter text-transparent">
              Criar conta
              <br />
              na ClickBeard
            </h1>
            <p className="mt-4 text-sm font-medium tracking-tight text-neutral-500">
              Preencha os dados abaixo para se cadastrar.
            </p>
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <LucideUser className="size-4 text-neutral-500" />
                <label
                  htmlFor="name"
                  className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
                >
                  Nome completo
                </label>
              </div>
              <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="h-full w-full rounded-md bg-transparent px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <p className="mt-1 h-[18px] text-xs text-red-500">
                {errors.name?.message}
              </p>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <LucideMail className="size-4 text-neutral-500" />
                <label
                  htmlFor="email"
                  className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
                >
                  e-mail
                </label>
              </div>
              <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-full w-full rounded-md bg-transparent px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Digite seu e-mail"
                />
              </div>
              <p className="mt-1 h-[18px] text-xs text-red-500">
                {errors.email?.message}
              </p>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <LucideLock className="size-4 text-neutral-500" />
                <label
                  htmlFor="password"
                  className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
                >
                  Senha
                </label>
              </div>
              <div className="mt-1.5 flex h-11 w-full items-center gap-3 rounded-md bg-[#0d0d0d] px-3">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-full flex-1 bg-transparent font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:outline-none"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <LucideEyeOff className="size-4 text-neutral-500" />
                  ) : (
                    <LucideEye className="size-4 text-neutral-500" />
                  )}
                </button>
              </div>
              <p className="mt-1 h-[18px] text-xs text-red-500">
                {errors.password?.message}
              </p>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <LucideLock className="size-4 text-neutral-500" />
                <label
                  htmlFor="confirmPassword"
                  className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
                >
                  Confirmar senha
                </label>
              </div>
              <div className="mt-1.5 flex h-11 w-full items-center gap-3 rounded-md bg-[#0d0d0d] px-3">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="h-full flex-1 bg-transparent font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:outline-none"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <LucideEyeOff className="size-4 text-neutral-500" />
                  ) : (
                    <LucideEye className="size-4 text-neutral-500" />
                  )}
                </button>
              </div>
              <p className="mt-1 h-[18px] text-xs text-red-500">
                {errors.confirmPassword?.message}
              </p>
            </div>
            <div className="mt-2 h-6">
              {mutation.isError && (
                <p className="text-xs text-red-500">
                  {(mutation.error as Error)?.message ||
                    "Ocorreu um erro no cadastro"}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-5 h-12 w-full cursor-pointer rounded-full bg-white font-medium tracking-tight text-black transition-all hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Criando conta..." : "Criar conta"}
            </button>
            <p className="mt-6 text-center">
              <span className="text-sm font-medium tracking-tight text-neutral-500">
                Já possui uma conta?
              </span>{" "}
              <Link
                to="/login"
                className="text-sm font-medium tracking-tight text-blue-400 underline-offset-4 hover:underline"
              >
                Faça login
              </Link>
            </p>
          </form>
        </PageLayout>
      </main>
    )
  );
}
