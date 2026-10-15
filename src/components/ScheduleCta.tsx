/**
 * Botão de agendamento repetido ao fim das seções, para o visitante não
 * precisar rolar até o formulário. A rolagem suave vem do efeito global
 * de âncoras (src/effects/smoothScroll.ts).
 */
export function ScheduleCta({ label = "Agendar avaliação" }: { label?: string }) {
  return (
    <div className="section-cta reveal">
      <a className="btn btn-primary mag" href="#contato">
        {label}
      </a>
    </div>
  );
}
