import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideMail,
  LucideMoveLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { useUserSession } from "../../hooks/use-user-session";
import PageLayout from "../../lib/components/page-layout";
import { authenticate } from "../../services/api/auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, saveSession } = useUserSession();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormInputs) => authenticate(data),
    onSuccess: (data) => {
      saveSession(data);
      navigate("/schedule");
    },
  });

  const onSubmit = (data: LoginFormInputs) => mutation.mutate(data);

  useEffect(() => {
    if (session) {
      navigate("/schedule");
    }
  }, [session, navigate]);

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout className="z-10 flex h-full flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="z-10 aspect-[9/10] w-[480px] rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-neutral-300/10 px-10 pt-8 pb-5 backdrop-blur-sm"
        >
          <Link to="/">
            <LucideMoveLeft className="size-6 text-neutral-300 hover:opacity-85" />
          </Link>

          <h1 className="mt-3 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl leading-14 font-semibold tracking-tighter text-transparent">
            Fazer login
            <br />
            na ClickBeard
          </h1>
          <p className="mt-4 text-sm font-medium tracking-tight text-neutral-500">
            Acesse sua conta para continuar.
          </p>

          {/* Email field */}
          <div className="mt-8">
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

          {/* Password field */}
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

          <div className="mt-2 h-6">
            {mutation.isError && (
              <p className="text-xs text-red-500">
                {(mutation.error as Error)?.message ||
                  "Ocorreu um erro no login"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-5 h-12 w-full cursor-pointer rounded-full bg-white font-medium tracking-tight text-black transition-all hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-6 text-center">
            <span className="text-sm font-medium tracking-tight text-neutral-500">
              Não possui uma conta?
            </span>{" "}
            <Link
              to="/register"
              className="text-sm font-medium tracking-tight text-blue-400 underline-offset-4 hover:underline"
            >
              Abra uma conta
            </Link>
          </p>
        </form>
      </PageLayout>
    </main>
  );
}
