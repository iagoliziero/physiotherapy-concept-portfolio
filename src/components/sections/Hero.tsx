import { IconSparkles } from "@tabler/icons-react";
import { HeroParticles } from "@/components/HeroParticles";
import { SceneMount } from "@/components/SceneMount";
import { SplitWords } from "@/components/SplitWords";

/** Hero (100vh): título com reveal, aurora, constelação e coluna 3D. */
export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      {/* Manchas de aurora animadas */}
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      <div className="blob blob--3" aria-hidden="true" />
      <HeroParticles />

      <div className="hero__inner">
        <div className="hero__copy">
          <span className="badge">
            <IconSparkles size={16} aria-hidden="true" /> Fisioterapia em domicílio
          </span>
          <h1 id="hero-title">
            <SplitWords text="Movimento sem dor" />
            <br />
            <span className="shine">começa aqui</span>
          </h1>
          <p className="hero__lead fade muted">
            Fisioterapia no conforto da sua casa, para você voltar a treinar, trabalhar e viver sem dor.
          </p>
          <div className="hero__ctas fade">
            <a className="btn btn-primary mag" href="#contato">
              Agendar avaliação
            </a>
            <a className="btn btn-ghost mag" href="#onde-doi">
              Onde dói?
            </a>
          </div>
        </div>
        <SceneMount scene="spine" className="hero__scene" label="Coluna vertebral 3D animada" />
      </div>
    </section>
  );
}
