export default function App() {
  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="container mx-auto flex h-full max-w-3xl flex-col items-center justify-center">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-7xl leading-20 font-black tracking-tighter text-transparent">
          Seja bem vindo ao
          <br />
          ClickBeard!
        </h1>
        <p className="mt-6 text-center text-xl leading-relaxed tracking-tight text-balance text-neutral-400">
          Agende seus cortes de cabelo de forma rápida e fácil
        </p>
        <button className="mx-auto mt-14 flex h-14 w-72 cursor-pointer items-center justify-center rounded-full bg-white text-lg font-medium tracking-tight transition-all hover:opacity-80">
          Agendar agora mesmo
        </button>
        <span className="mt-3 text-neutral-400">ou</span>
        <button className="mt-3 cursor-pointer text-blue-400 underline-offset-4 hover:underline">
          Abra sua conta
        </button>
      </div>
    </main>
  );
}
