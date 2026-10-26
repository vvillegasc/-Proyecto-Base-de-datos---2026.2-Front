export function formatPrice(value: number | null | undefined): string {
  return `$ ${(value ?? 0).toLocaleString('es-CO')}`;
}
