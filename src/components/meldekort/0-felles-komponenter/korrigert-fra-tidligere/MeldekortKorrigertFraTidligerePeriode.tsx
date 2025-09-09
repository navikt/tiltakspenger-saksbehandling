import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { meldeperiodeUrl } from '~/utils/urls';
import NextLink from 'next/link';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '~/utils/date';
import { MeldekortUker } from '../uker/MeldekortUker';
import { useSak } from '~/context/sak/SakContext';
import { MeldeperiodeKorrigering } from '~/types/meldekort/Meldeperiode';
import { MeldekortBeløp } from '../beløp/MeldekortBeløp';
import { useMeldeperiodeKjede } from '../../MeldeperiodeKjedeContext';

type Props = {
    korrigering: MeldeperiodeKorrigering;
    headerTekst?: string;
};

export const MeldekortKorrigertFraTidligerePeriode = ({ korrigering, headerTekst }: Props) => {
    const { alleMeldekortBehandlinger } = useMeldeperiodeKjede();
    const { saksnummer, sakId } = useSak().sak;
    const { periode, beregning, iverksatt, meldekortId } = korrigering;

    const behandlingsstatus = alleMeldekortBehandlinger.find(
        (mbeh) => mbeh.id === meldekortId,
    )?.status;

    const forrigeGodkjenteBeløp = alleMeldekortBehandlinger.find((mbeh) => mbeh.erAvsluttet)
        ?.beregning?.beregningForMeldekortetsPeriode.beløp;

    return (
        <VStack gap={'5'}>
            {headerTekst && <Heading size={'medium'}>{headerTekst}</Heading>}
            <Alert size={'small'} inline={true} variant={'warning'}>
                {'Korrigering av meldeperioden '}
                <Link href={meldeperiodeUrl(saksnummer, periode)} as={NextLink}>
                    {periodeTilFormatertDatotekst(periode)}
                </Link>
                {' endret på den siste beregningen av dette meldekortet.'}
            </Alert>
            <MeldekortUker dager={beregning.dager} />
            {iverksatt && (
                <BodyShort size={'small'}>
                    {'Iverksatt: '}
                    <strong>{formaterTidspunktKort(iverksatt)}</strong>
                </BodyShort>
            )}
            <MeldekortBeløp
                beløp={beregning.beløp}
                forrigeBeløp={forrigeGodkjenteBeløp}
                sakId={sakId}
                meldekortbehandlingId={meldekortId}
                behandlingsstatus={behandlingsstatus}
            />
        </VStack>
    );
};
