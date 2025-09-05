import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LucideClock, LucideMoveLeft, LucideStethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";
import PageLayout from "../../lib/components/page-layout";
import { createSpecialty } from "../../services/api/specialty";
import Navbar from "../navbar";

const specialtySchema = z.object({
  name: z.string().min(1, "Nome da especialidade obrigatório"),
  durationInMinutes: z
    .number({ message: "Duração deve ser um número" })
    // no mundo real isso pode ser outros valores multiplos de 15, mas aqui nao tem problema pois o desafio pediu assim :)
    .min(30, "Duração deve ser pelo menos 30 minutos")
    .max(30, "Duração deve ser no máximo 30 minutos"),
});

type SpecialtyFormInputs = z.infer<typeof specialtySchema>;

export default function CreateSpecialtyPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialtyFormInputs>({
    resolver: zodResolver(specialtySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SpecialtyFormInputs) => createSpecialty(data),
    onSuccess: () => {
      alert("Especialidade criada com sucesso!");
      reset();
    },
  });

  const onSubmit = (data: SpecialtyFormInputs) => {
    const formattedData = {
      ...data,
      durationInMinutes: Number(data.durationInMinutes),
    };
    mutation.mutate(formattedData);
  };

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout className="z-10 flex h-full flex-col items-center justify-center">
        <Navbar />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="z-10 aspect-[9/10] w-[480px] rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-neutral-300/10 px-10 pt-8 pb-5 backdrop-blur-sm"
        >
          <Link to="/">
            <LucideMoveLeft className="size-6 text-neutral-300 hover:opacity-85" />
          </Link>
          <h1 className="mt-3 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl leading-14 font-semibold tracking-tighter text-transparent">
            Nova
            <br />
            especialidade
          </h1>
          <p className="mt-4 text-sm font-medium tracking-tight text-neutral-500">
            Cadastre uma nova especialidade para seus serviços.
          </p>
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <LucideStethoscope className="size-4 text-neutral-500" />
              <label
                htmlFor="name"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                Nome da especialidade
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
              <input
                id="name"
                type="text"
                {...register("name")}
                className="h-full w-full rounded-md bg-transparent px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Ex: Corte de Cabelo"
              />
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.name?.message}
            </p>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <LucideClock className="size-4 text-neutral-500" />
              <label
                htmlFor="durationInMinutes"
                className="text-[13px] font-semibold tracking-wider text-neutral-500 uppercase"
              >
                Duração (minutos)
              </label>
            </div>
            <div className="mt-1.5 flex h-11 w-full rounded-md bg-[#0d0d0d]">
              <input
                id="durationInMinutes"
                type="number"
                min="1"
                max="480"
                defaultValue={30}
                {...register("durationInMinutes", { valueAsNumber: true })}
                className="h-full w-full rounded-md bg-transparent px-3 font-medium tracking-tight text-neutral-200 placeholder:font-medium placeholder:tracking-tight placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Ex: 30"
              />
            </div>
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.durationInMinutes?.message}
            </p>
          </div>

          <div className="mt-2 h-6">
            {mutation.isError && (
              <p className="text-xs text-red-500">
                {(mutation.error as Error)?.message ||
                  "Ocorreu um erro ao cadastrar a especialidade"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-5 h-12 w-full cursor-pointer rounded-full bg-white font-medium tracking-tight text-black transition-all hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Cadastrando..." : "Cadastrar especialidade"}
          </button>

          <p className="mt-6 text-center">
            <span className="text-sm font-medium tracking-tight text-neutral-500">
              Já possui todas as especialidades?
            </span>{" "}
            <Link
              to="/specialties"
              className="text-sm font-medium tracking-tight text-blue-400 underline-offset-4 hover:underline"
            >
              Ver especialidades
            </Link>
          </p>
        </form>
      </PageLayout>
    </main>
  );
}
