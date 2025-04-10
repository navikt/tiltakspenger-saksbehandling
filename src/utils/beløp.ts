export const formatterBeløp = (beløp: number) =>
    Intl.NumberFormat('no-nb', {
        style: 'currency',
        currency: 'NOK',
        trailingZeroDisplay: 'stripIfInteger',
    }).format(beløp);
