import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LucideCalendar,
  LucideCalendarRange,
  LucideLoader2,
  LucideMoveLeft,
  LucideUser,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import PageLayout from "../../lib/components/page-layout";
import { createBarber } from "../../services/api/barber";
import { getAllSpecialties } from "../../services/api/specialty";

const barberSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  age: z.number().min(18, "Idade mínima: 18"),
  hireDate: z.string().min(1, "Data de contratação obrigatória"),
  specialties: z.array(z.string()).min(1, "Selecione ao menos 1 especialidade"),
});

type BarberFormInputs = z.infer<typeof barberSchema>;

export default function RegisterBarberPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<BarberFormInputs>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      specialties: [],
    },
  });

  const {
    data: specialties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
  });

  const mutation = useMutation({
    mutationFn: createBarber,
    onSuccess: () => {
      alert("Barbeiro criado com sucesso!");
      reset();
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating barber:", error);
    },
  });

  const onSubmit = (data: BarberFormInputs) => {
    mutation.mutate({
      name: data.name,
      age: data.age,
      hiredAt: new Date(data.hireDate),
      specialtyIds: data.specialties,
    });
  };

  const handleSpecialtyToggle = (
    specialtyId: string,
    currentValue: string[],
  ) => {
    if (currentValue.includes(specialtyId)) {
      return currentValue.filter((id) => id !== specialtyId);
    } else {
      return [...currentValue, specialtyId];
    }
  };

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout className="flex h-full flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="z-10 w-[480px] rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-neutral-300/10 px-10 pt-8 pb-5 backdrop-blur-sm"
        >
          <Link to="/">
            <LucideMoveLeft className="size-6 text-neutral-300 hover:opacity-85" />
          </Link>

          <h1 className="mt-3 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl font-semibold text-transparent">
            Cadastrar Barbeiro
          </h1>

          <p className="mt-4 text-sm font-medium tracking-tight text-neutral-500">
            Adicione um novo barbeiro ao sistema
          </p>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 uppercase">
              <LucideUser className="size-4 text-neutral-500" />
              Nome
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1.5 h-11 w-full rounded-md bg-[#0d0d0d] px-3 text-neutral-200 placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400"
              placeholder="Nome do barbeiro"
              disabled={mutation.isPending}
            />
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.name?.message}
            </p>
          </div>

          <div className="mt-3">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 uppercase">
              <LucideCalendarRange className="size-4 text-neutral-500" />
              Idade
            </label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              className="mt-1.5 h-11 w-full rounded-md bg-[#0d0d0d] px-3 text-neutral-200 placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400"
              placeholder="Idade do barbeiro"
              disabled={mutation.isPending}
            />
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.age?.message}
            </p>
          </div>

          <div className="mt-3">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 uppercase">
              <LucideCalendar className="size-4 text-neutral-500" />
              Data de contratação
            </label>
            <input
              type="date"
              {...register("hireDate")}
              className="mt-1.5 h-11 w-full rounded-md bg-[#0d0d0d] px-3 text-neutral-200 placeholder:text-neutral-700 focus:ring-2 focus:ring-blue-400"
              disabled={mutation.isPending}
            />
            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.hireDate?.message}
            </p>
          </div>

          <div className="mt-3">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-neutral-500 uppercase">
              Especialidades
            </label>

            {isLoading ? (
              <div className="mt-1.5 flex h-28 w-full items-center justify-center rounded-md bg-[#0d0d0d]">
                <LucideLoader2 className="size-5 animate-spin text-neutral-500" />
                <span className="ml-2 text-sm text-neutral-500">
                  Carregando especialidades...
                </span>
              </div>
            ) : isError ? (
              <div className="mt-1.5 flex h-28 w-full items-center justify-center rounded-md bg-[#0d0d0d]">
                <span className="text-sm text-red-500">
                  Erro ao carregar especialidades
                </span>
              </div>
            ) : (
              <Controller
                name="specialties"
                control={control}
                render={({ field }) => (
                  <div className="mt-1.5 flex h-fit flex-wrap overflow-y-auto rounded-md bg-[#0d0d0d] p-2">
                    {specialties.map((spec) => (
                      <label
                        key={spec.id}
                        className="flex h-fit w-fit shrink-0 grow cursor-pointer items-center gap-2 rounded p-1 px-2 py-1 hover:bg-neutral-800"
                      >
                        <input
                          type="checkbox"
                          checked={field.value.includes(spec.id)}
                          onChange={() => {
                            const newValue = handleSpecialtyToggle(
                              spec.id,
                              field.value,
                            );
                            field.onChange(newValue);
                          }}
                          disabled={isLoading || mutation.isPending}
                          className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-blue-400 focus:ring-2 focus:ring-blue-400"
                        />
                        <span className="text-sm text-neutral-200">
                          {spec.name} ({spec.durationInMinutes} min)
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
            )}

            <p className="mt-1 h-[18px] text-xs text-red-500">
              {errors.specialties?.message}
            </p>
          </div>

          <div className="mt-2 h-6">
            {mutation?.isError && (
              <p className="text-xs text-red-500">
                {(mutation.error as Error)?.message ||
                  "Ocorreu um erro no login"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || mutation.isPending}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-medium text-black transition-all hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <LucideLoader2 className="size-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Barbeiro"
            )}
          </button>
        </form>
      </PageLayout>
    </main>
  );
}
