/**
 * Executa `callback` uma única vez quando `el` chega perto da área visível.
 * Usado para só criar as cenas 3D (e seus contextos WebGL) quando necessário.
 */
export function whenNearViewport(el: Element, callback: () => void, rootMargin = "300px"): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      callback();
    },
    { rootMargin },
  );
  observer.observe(el);
  return () => observer.disconnect();
}
