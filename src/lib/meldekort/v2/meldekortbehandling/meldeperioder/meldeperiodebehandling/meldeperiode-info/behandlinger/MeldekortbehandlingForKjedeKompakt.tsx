import { Alert, BodyShort, Heading, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
    MeldekortDagBeregnetProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { ukedagFraDatoKort, ukenummerFraDatotekst } from '~/utils/date';
import {
    meldekortbehandlingDagStatusTekstKort,
    meldekortbehandlingStatusTekst,
    meldeperiodebehandlingTypeTekst,
} from '~/lib/meldekort/v2/tekster';
import { ikonForMeldekortbehandlingDagStatus } from '~/lib/meldekort/0-felles-komponenter/MeldekortIkoner';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';

import style from './MeldekortbehandlingForKjedeKompakt.module.css';

type Props = {
    meldekortbehandlingId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldekortbehandlingForKjedeKompakt = ({ meldekortbehandlingId, kjedeId }: Props) => {
    const { sak } = useSak();

    const meldekortbehandling = hentMeldekortbehandling(sak, meldekortbehandlingId);

    const meldeperiodebehandling = meldekortbehandling.meldeperioder.find(
        (it) => it.kjedeId === kjedeId,
    );

    if (!meldeperiodebehandling) {
        return (
            <Alert variant={'error'}>
                {`Teknisk feil: Fant ingen behandling av denne meldeperioden på ${meldekortbehandling.id}`}
            </Alert>
        );
    }

    const dager: MeldekortDagBeregnetProps[] =
        meldeperiodebehandling.beregning?.dager ??
        meldeperiodebehandling.dager.map((dag) => ({ ...dag }));

    return (
        <VStack gap={'space-8'}>
            <HStack className={style.header} gap={'space-12'}>
                <Heading level={'4'} size={'xsmall'}>
                    {meldeperiodebehandlingTypeTekst[meldeperiodebehandling.type]}
                </Heading>
                <Tag
                    data-color={meldekortbehandlingStatusFarge[meldekortbehandling.status]}
                    variant={'outline'}
                    size={'small'}
                >
                    {meldekortbehandlingStatusTekst[meldekortbehandling.status]}
                </Tag>
            </HStack>

            <InternLenke href={meldekortbehandlingUrl(sak.saksnummer, meldekortbehandling.id)}>
                <BodyShort size={'small'}>{'Åpne behandlingen'}</BodyShort>
            </InternLenke>

            <Table size={'small'} className={style.tabell}>
                <Table.Body>
                    <Uke dager={dager.slice(0, 7)} />
                    <Table.Row>
                        <Table.DataCell colSpan={3} className={style.spacerRow} />
                    </Table.Row>
                    <Uke dager={dager.slice(7, 14)} />
                </Table.Body>
            </Table>
        </VStack>
    );
};

const Uke = ({ dager }: { dager: MeldekortDagBeregnetProps[] }) => {
    if (dager.length === 0) {
        return null;
    }

    return (
        <>
            <Table.Row>
                <Table.HeaderCell colSpan={3}>
                    {`Uke ${ukenummerFraDatotekst(dager[0].dato)}`}
                </Table.HeaderCell>
            </Table.Row>

            {dager.map(({ dato, status, beregningsdag }) => (
                <Table.Row key={dato}>
                    <Table.DataCell>{ukedagFraDatoKort(dato)}</Table.DataCell>
                    <Table.DataCell className={style.status}>
                        <HStack align={'center'} gap={'space-12'} wrap={false}>
                            {ikonForMeldekortbehandlingDagStatus[status]}
                            {meldekortbehandlingDagStatusTekstKort[status]}
                        </HStack>
                    </Table.DataCell>
                    <Table.DataCell className={style.sats}>
                        {beregningsdag ? `${beregningsdag.prosent} %` : '–'}
                    </Table.DataCell>
                </Table.Row>
            ))}
        </>
    );
};

const meldekortbehandlingStatusFarge: Record<MeldekortbehandlingStatus, AkselColor> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.GODKJENT]: 'success',
    [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET]: 'success',
    [MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'danger',
    [MeldekortbehandlingStatus.AVBRUTT]: 'neutral',
};
