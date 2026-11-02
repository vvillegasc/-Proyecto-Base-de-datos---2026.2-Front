// Espacio que no se corta (\u00A0): así "$" y el número nunca quedan en líneas distintas.
export function formatPrice(value: number | null | undefined): string {
  return `$\u00A0${(value ?? 0).toLocaleString('es-CO')}`;
}
