export const classNames = (...classNames: unknown[]) =>
    classNames
        .reduce<string>(
            (acc, className) => (typeof className === 'string' ? `${acc} ${className}` : acc),
            '',
        )
        .trim();
