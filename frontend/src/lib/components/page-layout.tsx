import { twMerge } from "tailwind-merge";

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function PageLayout({
  className,
  children,
  ...rest
}: PageLayoutProps) {
  return (
    <div
      {...rest}
      className={twMerge("container mx-auto h-full max-w-3xl", className)}
    >
      {children}
    </div>
  );
}
