export type NumberRange = {
    min: number;
    max: number;
};

export const minOgMax = (tall: number[]): NumberRange => {
    if (tall.length === 0) {
        throw Error('Må ha minst ett tall');
    }

    return {
        min: Math.min(...tall),
        max: Math.max(...tall),
    };
};

export const numberRangeToString = ({ min, max }: NumberRange): string => {
    return `${min}${min != max ? ` - ${max}` : ''}`;
};
