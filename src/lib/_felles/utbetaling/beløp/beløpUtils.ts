export const formatterBeløp = (beløp: number, options?: Intl.NumberFormatOptions) =>
    Intl.NumberFormat('no-nb', {
        style: 'currency',
        currency: 'NOK',
        trailingZeroDisplay: 'stripIfInteger',
        ...options,
    }).format(beløp);
