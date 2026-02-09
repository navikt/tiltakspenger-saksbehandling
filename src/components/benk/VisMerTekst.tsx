import React from 'react';
import { Button } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    tekst?: Nullable<string>;
    antallTegnFørVisMer: number;
};

const VisMerTekst = ({ tekst, antallTegnFørVisMer }: Props) => {
    const [visMer, setVisMer] = React.useState(false);

    if (!tekst) {
        return null;
    }

    const truncateWithEllipsis = (tekst: Nullable<string>, visTegnInntil = 40): string => {
        if (tekst && tekst.length <= visTegnInntil) {
            return tekst;
        }
        // Skjuler litt mer enn visTegnInntil siste del av teksten for å få plass til "Vis mer"-knappen.
        return tekst?.slice(0, visTegnInntil - visTegnInntil / 4) + '...';
    };

    const tekstOverskriderMaksAntall = tekst.length > antallTegnFørVisMer;

    return (
        <>
            {visMer || !tekstOverskriderMaksAntall
                ? tekst
                : truncateWithEllipsis(tekst, antallTegnFørVisMer)}
            {tekstOverskriderMaksAntall && (
                <Button
                    variant="tertiary"
                    size="small"
                    type="button"
                    onClick={() => setVisMer((prev) => !prev)}
                >
                    {visMer ? 'Vis mindre' : 'Vis mer'}
                </Button>
            )}
        </>
    );
};

export default VisMerTekst;
