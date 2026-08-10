import { Hero } from "../components/Hero";
import { Studio } from "../components/Studio";
import { Write } from "../components/Write";
import { Cinematics } from "../components/Cinematics";
import { Recommendations } from "../components/Recommendations";

export function Home() {
  return (
    <>
      <Hero />
      <Studio />
      <Write />
      <Cinematics />
      <Recommendations />
    </>
  );
}