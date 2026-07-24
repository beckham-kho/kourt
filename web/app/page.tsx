import Navbar from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="h-screen w-full px-40 flex flex-col">
      <Navbar />
      <section className="grid grid-cols-2 flex-1 max-h-3/4">
        <div className="h-full w-full gap-2 flex flex-col justify-center items-start">
          <div className="font-extrabold text-5xl leading-tight">
            <h1>Book Your Kourt,</h1>
            <h1>Own the Game!</h1>
          </div>
          <div>
            <p className="text-muted-foreground">Sports court booking app</p>
          </div>
        </div>
        <div className="h-full w-full items-center justify-center flex">
          <h1>[images]</h1>
        </div>
      </section>
    </div>
  );
}
