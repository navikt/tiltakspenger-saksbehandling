import { Alert, BodyShort, Link, VStack } from '@navikt/ds-react';
import { meldeperiodeUrl } from '../../../../../../utils/urls';
import NextLink from 'next/link';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '../../../../../../utils/date';
import { MeldekortOppsummeringUke } from '../MeldekortOppsummeringUke';
import { useSak } from '../../../../../../context/sak/SakContext';
import { MeldeperiodeKorrigering } from '../../../../../../types/meldekort/Meldeperiode';

import style from './MeldekortOppsummeringKorrigeringer.module.css';

type Props = {
    korrigering: MeldeperiodeKorrigering;
};

export const MeldekortKorrigertOppsummering = ({ korrigering }: Props) => {
    const { saksnummer } = useSak().sak;
    const { periode, beregning, iverksatt } = korrigering;

    return (
        <VStack gap={'5'} className={style.korrigering}>
            <Alert size={'small'} inline={true} variant={'info'}>
                {'Korrigering av meldeperioden '}
                <Link href={meldeperiodeUrl(saksnummer, periode)} as={NextLink}>
                    {periodeTilFormatertDatotekst(periode)}
                </Link>
                {' endret på siste beregningen av dette meldekortet.'}
            </Alert>
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(0, 7)} />
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(7, 14)} />
            {iverksatt && (
                <BodyShort size={'small'}>
                    {'Iverksatt: '}
                    <strong>{formaterTidspunktKort(iverksatt)}</strong>
                </BodyShort>
            )}
        </VStack>
    );
};
