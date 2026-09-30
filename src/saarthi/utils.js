export function revealAndScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const parentDisclosure = target.closest('details');
  if (parentDisclosure) parentDisclosure.open = true;

  window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}
