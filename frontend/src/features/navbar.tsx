import {
  LucideCalendar,
  LucideChevronRight,
  LucideLogOut,
  LucideUser,
} from "lucide-react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { useUserSession } from "../hooks/use-user-session";

type NavbarProps = React.HTMLAttributes<HTMLDivElement>;

const MENU_ITEMS = [
  {
    label: "Agendamentos",
    to: "/me/appointments",
    icon: LucideCalendar,
  },
  {
    label: "Perfil",
    to: "/me/profile",
    icon: LucideUser,
  },
];

const NAVBAR_LINKS = [
  {
    label: "Admin panel",
    to: "/admin",
  },
  {
    label: "Cadastrar barbeiro",
    to: "/barber/new",
  },
  {
    label: "Cadastrar especialidade",
    to: "/specialty/new",
  },
];

export default function Navbar({ className, ...rest }: NavbarProps) {
  const { session, clearSession } = useUserSession();

  return (
    <nav
      {...rest}
      className={twMerge(
        "absolute top-0 left-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#0d0d0d]",
        className,
      )}
    >
      <div>
        <Link to={"/"}>
          <span className="text-xl font-bold tracking-tight text-neutral-300">
            ClickBeard
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {NAVBAR_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex h-9 cursor-pointer items-center justify-center text-neutral-400 transition-all hover:text-neutral-300"
          >
            {label}
            <LucideChevronRight className="ml-1 size-[18px]" />
          </Link>
        ))}
        {session && session.user ? (
          <div className="flex items-center justify-center gap-3">
            <DialogTrigger>
              <Button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-xl font-medium text-white uppercase transition-all hover:bg-blue-600">
                {session.user.name[0]}
              </Button>
              <Dialog>
                <Popover
                  className={
                    "flex h-fit w-72 flex-col rounded-xl border border-white/5 bg-[#0d0d0d] py-2"
                  }
                >
                  {MENU_ITEMS.map(({ icon: Icon, label, to }, index) => {
                    return (
                      <Link
                        to={to}
                        key={label + index}
                        className="flex w-full cursor-pointer items-center gap-4 px-4 py-2 text-left font-medium tracking-tight text-neutral-300 transition-all hover:bg-[#2d2d2d]"
                      >
                        <Icon className="size-[18px]" />
                        {label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={clearSession}
                    className="flex w-full cursor-pointer items-center gap-4 px-4 py-2 text-left font-medium tracking-tight text-neutral-300 transition-all hover:bg-[#2d2d2d]"
                  >
                    <LucideLogOut className="size-[18px]" />
                    Sair
                  </button>
                </Popover>
              </Dialog>
            </DialogTrigger>
          </div>
        ) : (
          <Link
            to={"/login"}
            className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-full border border-white/5 bg-blue-800/15 px-4 font-medium tracking-tight text-blue-200 transition-all hover:opacity-85"
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
