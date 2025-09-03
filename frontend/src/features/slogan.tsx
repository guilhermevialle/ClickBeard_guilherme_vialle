import { Link } from "react-router";
import PageLayout from "../lib/components/page-layout";

type SloganProps = React.HTMLAttributes<HTMLDivElement>;

export default function Slogan({ ...rest }: SloganProps) {
  return (
    <PageLayout
      {...rest}
      className="relative z-10 flex flex-col items-center justify-center"
    >
      <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-7xl leading-20 font-black tracking-tighter text-transparent">
        Seja bem vindo ao
        <br />
        ClickBeard!
      </h1>
      <p className="mt-6 text-center text-xl leading-relaxed tracking-tight text-balance text-neutral-400">
        Agende seus cortes de cabelo de forma rápida e fácil
      </p>
      <Link
        to="/schedule"
        className="mx-auto mt-14 flex h-14 w-72 cursor-pointer items-center justify-center rounded-full bg-white text-lg font-medium tracking-tight transition-all hover:opacity-80"
      >
        Agendar agora mesmo
      </Link>
      <span className="mt-3 text-neutral-400">ou</span>
      <Link
        to="/register"
        className="mt-3 cursor-pointer text-blue-400 underline-offset-4 hover:underline"
      >
        Abra sua conta
      </Link>
    </PageLayout>
  );
}
