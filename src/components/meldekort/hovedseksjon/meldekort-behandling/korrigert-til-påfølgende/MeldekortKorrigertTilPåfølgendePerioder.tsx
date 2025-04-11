import { Alert, BodyShort, Link } from '@navikt/ds-react';
import { MeldeperiodeBeregning } from '../../../../../types/meldekort/MeldekortBehandling';
import NextLink from 'next/link';
import { meldeperiodeUrl } from '../../../../../utils/urls';
import { useSak } from '../../../../../context/sak/SakContext';
import { periodeTilFormatertDatotekst } from '../../../../../utils/date';
import { formatterBeløp } from '../../../../../utils/beløp';

import style from './MeldekortKorrigertTilPåfølgendePerioder.module.css';

type Props = {
    beregninger: MeldeperiodeBeregning[];
};

export const MeldekortKorrigertTilPåfølgendePerioder = ({ beregninger }: Props) => {
    const { saksnummer } = useSak().sak;

    const antall = beregninger.length;

    if (antall === 0) {
        return null;
    }

    return (
        <Alert variant={'info'} inline={true}>
            <BodyShort
                size={'small'}
                className={style.toppTekst}
            >{`Korrigeringen påvirket beregningen av ${antall} påfølgende periode${antall > 1 ? 'r' : ''}:`}</BodyShort>
            {beregninger.map((beregning) => (
                <BodyShort key={beregning.kjedeId} size={'small'}>
                    <Link as={NextLink} href={meldeperiodeUrl(saksnummer, beregning.periode)}>
                        {periodeTilFormatertDatotekst(beregning.periode)}
                    </Link>
                    {' - Beløp: '}
                    <strong>{formatterBeløp(beregning.beløp.totalt)}</strong>
                </BodyShort>
            ))}
        </Alert>
    );
};
