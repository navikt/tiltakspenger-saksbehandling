import { BodyShort, Heading, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import {
    behandlingsstatusFarge,
    behandlingsstatusTekst,
} from '~/lib/behandling-felles/status/behandlingsstatus';
import {
    MeldekortbehandlingId,
    MeldekortDagBeregnetProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import {
    ukedagFraDatoKort,
    ukenummerFraDatotekst,
    formaterDatotekst,
    ukedagFraDato,
} from '~/utils/date';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import {
    meldekortbehandlingDagStatusTekstKort,
    meldeperiodebehandlingTypeTekst,
} from '~/lib/meldekort/utils/meldekortTekster';
import { ikonForMeldekortbehandlingDagStatus } from '~/lib/meldekort/utils/meldekortIkoner';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { BeregningForMeldeperiodeKjede } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/beregning/BeregningForMeldeperiodeKjede';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

import style from './MeldekortbehandlingForKjedeKompakt.module.css';

type Props = {
    meldekortbehandlingId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldekortbehandlingForKjedeKompakt = ({ meldekortbehandlingId, kjedeId }: Props) => {
    const { sak } = useSak();

    const { id, meldeperioder, status, simulertBeregning } = hentMeldekortbehandling(
        sak,
        meldekortbehandlingId,
    );

    const meldeperiodebehandling = meldeperioder.find((it) => it.kjedeId === kjedeId);

    if (!meldeperiodebehandling) {
        return (
            <Infokort variant={'feil'}>
                {`Teknisk feil: Fant ingen behandling av denne meldeperioden på ${id}`}
            </Infokort>
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
                <Tag data-color={behandlingsstatusFarge(status)} variant={'outline'} size={'small'}>
                    {behandlingsstatusTekst(status)}
                </Tag>
            </HStack>

            <InternLenke href={meldekortbehandlingUrl(sak.saksnummer, id)}>
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

            {simulertBeregning && (
                <BeregningForMeldeperiodeKjede
                    kjedeId={kjedeId}
                    simulertBeregning={simulertBeregning}
                    className={style.beregning}
                />
            )}
        </VStack>
    );
};

const Uke = ({ dager }: { dager: MeldekortDagBeregnetProps[] }) => {
    return (
        <>
            <Table.Row>
                <Table.HeaderCell colSpan={3}>
                    {`Uke ${ukenummerFraDatotekst(dager[0].dato)}`}
                </Table.HeaderCell>
            </Table.Row>

            {dager.map(({ dato, status, beregningsdag }) => (
                <RichTooltip
                    key={dato}
                    content={<DagDetaljer dato={dato} beregningsdag={beregningsdag} />}
                    placement={'right'}
                >
                    <Table.Row>
                        <Table.DataCell>{ukedagFraDatoKort(dato)}</Table.DataCell>
                        <Table.DataCell className={style.status}>
                            <HStack align={'center'} gap={'space-12'} wrap={false}>
                                {ikonForMeldekortbehandlingDagStatus[status]}
                                {meldekortbehandlingDagStatusTekstKort[status]}
                            </HStack>
                        </Table.DataCell>
                        <Table.DataCell className={style.sats}>
                            {beregningsdag ? `${beregningsdag.prosent}%` : '–'}
                        </Table.DataCell>
                    </Table.Row>
                </RichTooltip>
            ))}
        </>
    );
};

const DagDetaljer = ({
    dato,
    beregningsdag,
}: {
    dato: string;
    beregningsdag: MeldekortDagBeregnetProps['beregningsdag'];
}) => {
    return (
        <VStack gap={'space-4'}>
            <BodyShort weight={'semibold'}>
                {`${ukedagFraDato(dato)} ${formaterDatotekst(dato)}`}
            </BodyShort>

            {beregningsdag && (
                <>
                    <DetaljHorisontal navn={'Sats:'} size={'small'}>
                        {`${beregningsdag.prosent}%`}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Beløp:'} size={'small'}>
                        {formatterBeløp(beregningsdag.beløp)}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Barnetillegg:'} size={'small'}>
                        {formatterBeløp(beregningsdag.barnetillegg)}
                    </DetaljHorisontal>
                </>
            )}
        </VStack>
    );
};
