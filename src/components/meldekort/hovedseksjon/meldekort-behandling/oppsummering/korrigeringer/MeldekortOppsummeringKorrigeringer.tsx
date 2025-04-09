import { Alert, Link, VStack } from '@navikt/ds-react';
import { meldeperiodeUrl } from '../../../../../../utils/urls';
import NextLink from 'next/link';
import { periodeTilFormatertDatotekst } from '../../../../../../utils/date';
import { MeldekortOppsummeringUke } from '../MeldekortOppsummeringUke';
import { MeldeperiodeKorrigering } from '../../../../../../types/meldekort/MeldekortBehandling';
import { useSak } from '../../../../../../context/sak/SakContext';

import style from './MeldekortOppsummeringKorrigeringer.module.css';

type Props = {
    korrigering: MeldeperiodeKorrigering;
};

export const MeldekortOppsummeringKorrigeringer = ({ korrigering }: Props) => {
    const { saksnummer } = useSak().sak;
    const { periode, beregning } = korrigering;

    return (
        <VStack gap={'5'} className={style.korrigering}>
            <Alert size={'small'} inline={true} variant={'info'}>
                {'Korrigering av meldeperioden '}
                <Link href={meldeperiodeUrl(saksnummer, periode)} as={NextLink}>
                    {periodeTilFormatertDatotekst(periode)}
                </Link>
                {` endret på beregningen av dette meldekortet.`}
            </Alert>
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(0, 7)} />
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(7, 14)} />
        </VStack>
    );
};
