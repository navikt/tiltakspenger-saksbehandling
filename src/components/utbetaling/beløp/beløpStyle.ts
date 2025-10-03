import style from './beløpStyle.module.css';

export const beløpStyle = (beløp?: number) => {
    return !beløp ? undefined : beløp > 0 ? style.positiv : style.negativ;
};
