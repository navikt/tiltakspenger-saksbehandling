import { List, ListProps } from '@navikt/ds-react';

type Props = {
    tekster: string[];
    liClassname?: string;
} & Omit<ListProps, 'children'>;

export const TekstListe = ({ tekster, liClassname, ...rest }: Props) => {
    if (tekster.length === 0) {
        return null;
    }

    return (
        <List {...rest}>
            {tekster.map((tekst, index) => (
                <List.Item className={liClassname} key={index}>
                    {tekst}
                </List.Item>
            ))}
        </List>
    );
};
