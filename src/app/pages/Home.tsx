import { Hero } from "../components/Hero";
import { Studio } from "../components/Studio";
import { Write } from "../components/Write";
import { Recommendations } from "../components/Recommendations";

export function Home() {
  return (
    <>
      <Hero />
      <Studio />
      <Write />
      <Recommendations />
    </>
  );
}