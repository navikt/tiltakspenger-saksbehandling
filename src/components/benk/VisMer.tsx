import React from 'react';
import { Button } from '@navikt/ds-react';

type Props = {
    tekst: string;
    visEllipsis?: boolean;
    antallTegnFørVisMer?: number;
};

const VisMer = ({ tekst, visEllipsis = true, antallTegnFørVisMer = 0 }: Props) => {
    const [visMer, setVisMer] = React.useState(false);

    if (!tekst) {
        return null;
    }

    const truncateWithEllipsis = (tekst: string, visTegnInntil: number): string => {
        if (tekst.length <= visTegnInntil) {
            return tekst;
        }
        // Skjuler litt mer enn visTegnInntil siste del av teksten for å få plass til "Vis mer"-knappen.
        return tekst?.slice(0, visTegnInntil - visTegnInntil / 4) + (visEllipsis ? '...' : '');
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

export default VisMer;
