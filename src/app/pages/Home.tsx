import { Hero } from "../components/Hero";
import { Studio } from "../components/Studio";
import { Write } from "../components/Write";
import { Cinematics } from "../components/Cinematics";

export function Home() {
  return (
    <>
      <Hero />
      <Studio />
      <Write />
      <Cinematics />
    </>
  );
}