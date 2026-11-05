export function formatPrice(value: number | null | undefined): string {
  return `$\u00A0${(value ?? 0).toLocaleString('es-CO')}`;
}
