import Navbar from "./features/navbar";
import Slogan from "./features/slogan";
import PageLayout from "./lib/components/page-layout";

export default function App() {
  return (
    <main className="relative h-screen w-full bg-[#0d0d0d]">
      <PageLayout>
        <Navbar />
        <Slogan />
      </PageLayout>
      <div className="absolute inset-0 z-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#6d6d6d_100%)]"></div>
    </main>
  );
}
