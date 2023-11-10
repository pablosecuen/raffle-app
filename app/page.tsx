import SorteoApp from "./sorteo-app/sorteo-app";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden flex-col items-center justify-evenly p-10 ">
      <SorteoApp />
    </main>
  );
}
