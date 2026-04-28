type Props = {
    tekster: string[];
    className?: string;
    liClassname?: string;
};

export const TekstListe = ({ tekster, liClassname, className }: Props) => {
    if (tekster.length === 0) {
        return null;
    }

    return (
        <ul className={className}>
            {tekster.map((tekst, index) => (
                <li className={liClassname} key={index}>
                    {tekst}
                </li>
            ))}
        </ul>
    );
};
