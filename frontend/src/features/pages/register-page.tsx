import { zodResolver } from "@hookform/resolvers/zod";
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

// Schema de validação
const registerSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ email, name, password }: RegisterFormInputs) => {
    const response = await registerUser({
      email,
      name,
      password,
    });
    const hasError = "error" in response;

    if (!hasError) {
      saveSession(response);
      navigate("/schedule");
    }
  };

  useEffect(() => {
    if (session) {
      navigate("/schedule");
    }
  }, [session]);

  return (
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
              <LucideUser className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
              <label
                htmlFor="name"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                Nome completo
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
              <input
                type="text"
                {...register("name")}
                className="h-full grow px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700"
                placeholder="Digite seu nome completo"
              />
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.name?.message}
            </p>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <LucideMail className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
              <label
                htmlFor="email"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                e-mail
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
              <input
                type="text"
                {...register("email")}
                className="h-full grow px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700"
                placeholder="Digite seu e-mail"
              />
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.email?.message}
            </p>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <LucideLock className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
              <label
                htmlFor="password"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                Senha
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full gap-3 rounded-md bg-[#0d0d0d]">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="h-full grow px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <LucideEyeOff className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
                ) : (
                  <LucideEye className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
                )}
              </button>
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.password?.message}
            </p>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <LucideLock className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
              <label
                htmlFor="confirmPassword"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                Confirmar senha
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full gap-3 rounded-md bg-[#0d0d0d]">
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="h-full grow px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700"
                placeholder="Confirme sua senha"
              />
              <button
                type="button"
                className="w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <LucideEyeOff className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
                ) : (
                  <LucideEye className="size-4 font-semibold tracking-wider text-neutral-500 uppercase" />
                )}
              </button>
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 h-12 w-full cursor-pointer rounded-full bg-white font-medium tracking-tight text-black transition-all hover:opacity-85 active:scale-[0.98]"
          >
            Criar conta
          </button>

          <p className="mt-6 text-center">
            <span className="text-sm font-medium tracking-tight text-neutral-500">
              Já possui uma conta?
            </span>{" "}
            <a
              href="/login"
              className="text-sm font-medium tracking-tight text-blue-400 underline-offset-4 hover:underline"
            >
              Faça login
            </a>
          </p>
        </form>
      </PageLayout>
    </main>
  );
}
