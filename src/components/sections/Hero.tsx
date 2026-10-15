import { HeroParticles } from "@/components/HeroParticles";
import { SceneMount } from "@/components/SceneMount";
import { SplitWords } from "@/components/SplitWords";

/** Hero (100vh): título com reveal palavra por palavra, aurora, constelação e coluna 3D. */
export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      {/* Manchas de aurora animadas */}
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      <div className="blob blob--3" aria-hidden="true" />
      <HeroParticles />

      <div className="hero__inner">
        <div className="hero__copy" data-hero-copy="">
          {/* Quebras fixas: o título mantém as mesmas três linhas em qualquer tela */}
          <h1 id="hero-title">
            <SplitWords text={"Fisioterapia\nque vai até"} />
            <br />
            <span className="shine">a sua casa</span>
          </h1>
          <p className="hero__lead reveal muted">
            Trato dor de cabeça tensional, DTM e dores no pescoço e nas costas, e cuido da recuperação de quem
            treina. Você agenda pelo WhatsApp e eu vou até você.
          </p>
          <div className="hero__ctas reveal">
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
