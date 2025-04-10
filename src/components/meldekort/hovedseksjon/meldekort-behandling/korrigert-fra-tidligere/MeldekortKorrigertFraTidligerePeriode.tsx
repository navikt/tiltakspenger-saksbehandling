import { Alert, BodyShort, Link, VStack } from '@navikt/ds-react';
import { meldeperiodeUrl } from '../../../../../utils/urls';
import NextLink from 'next/link';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '../../../../../utils/date';
import { MeldekortOppsummeringUke } from '../oppsummering/uke/MeldekortOppsummeringUke';
import { useSak } from '../../../../../context/sak/SakContext';
import { MeldeperiodeKorrigering } from '../../../../../types/meldekort/Meldeperiode';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortBehandlingStatus } from '../../../../../types/meldekort/MeldekortBehandling';

import style from './MeldekortKorrigertFraTidligerePeriode.module.css';

type Props = {
    korrigering: MeldeperiodeKorrigering;
};

export const MeldekortKorrigertFraTidligerePeriode = ({ korrigering }: Props) => {
    const { meldekortBehandlingerSortert } = useMeldeperiodeKjede();
    const { saksnummer } = useSak().sak;
    const { periode, beregning, iverksatt } = korrigering;

    const forrigeGodkjenteBeløp = meldekortBehandlingerSortert.find(
        (mbeh) => mbeh.status === MeldekortBehandlingStatus.GODKJENT,
    )?.beregning?.beregningForMeldekortetsPeriode.beløp;

    return (
        <VStack gap={'5'} className={style.korrigering}>
            <Alert size={'small'} inline={true} variant={'info'}>
                {'Korrigering av meldeperioden '}
                <Link href={meldeperiodeUrl(saksnummer, periode)} as={NextLink}>
                    {periodeTilFormatertDatotekst(periode)}
                </Link>
                {' endret på beregningen av dette meldekortet.'}
            </Alert>
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(0, 7)} />
            <MeldekortOppsummeringUke utbetalingUke={beregning.dager.slice(7, 14)} />
            {iverksatt && (
                <BodyShort size={'small'}>
                    {'Iverksatt: '}
                    <strong>{formaterTidspunktKort(iverksatt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeløp beløp={beregning.beløp} forrigeBeløp={forrigeGodkjenteBeløp} />
        </VStack>
    );
};
