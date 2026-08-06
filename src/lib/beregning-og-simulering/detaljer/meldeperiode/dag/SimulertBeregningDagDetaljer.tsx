import { BodyShort, HStack, Table, Tag } from '@navikt/ds-react';
import {
    SimulertBeregningDag,
    SimulertBeregningDagMedBeregning,
    Simuleringsmerke,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { erHelg, formaterDatotekst, ukedagFraDatoKort } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { beløpStyle } from '~/lib/_felles/utbetaling/beløp/beløpStyle';
import { tilKompakteMerker } from './simuleringsmerker';
import { ikonForMeldekortbehandlingDagStatus } from '~/lib/meldekort/utils/meldekortIkoner';
import { PartialRecord } from '~/types/UtilTypes';
import { meldekortbehandlingDagStatusTekst } from '~/lib/meldekort/utils/meldekortTekster';

import style from './SimulertBeregningDagDetaljer.module.css';

type Props = {
    dag: SimulertBeregningDag;
    harSimulering: boolean;
};

/**
 * Én dag i beregningen, med simuleringsstatusen dens.
 *
 * Dagen viser beløp fra vår egen beregning, men ikke fra simuleringen.
 * Oppdragssystemet svarer med posteringer per periode, og hvor mye av et beløp som hører til en enkelt dag finnes ikke i kilden.
 * Dagen merkes i stedet med posteringene som treffer den, og simuleringsbeløpene vises der de er reelle: per meldeperiode og totalt.
 */
export const SimulertBeregningDagDetaljer = ({ dag, harSimulering }: Props) => {
    const { beregning, dato, status, merker } = dag;

    return (
        <Table.Row className={classNames(style.meldeperiodeDag, erHelg(dato) && style.helgedag)}>
            <Table.DataCell>{`${ukedagFraDatoKort(dato)} ${formaterDatotekst(dato)}`}</Table.DataCell>
            {beregning ? (
                <BeregningCells beregning={beregning} status={status} />
            ) : (
                <Table.DataCell colSpan={9} className={style.ikkeBeregnet}>
                    <BodyShort size={'small'} className={style.ikkeBeregnetTekst}>
                        {'Ikke beregnet'}
                    </BodyShort>
                </Table.DataCell>
            )}
            {harSimulering ? (
                <SimuleringsstatusCell merker={merker} harBeregning={beregning !== null} />
            ) : (
                <Table.DataCell>
                    <BodyShort size={'small'}>{'Ikke simulert'}</BodyShort>
                </Table.DataCell>
            )}
        </Table.Row>
    );
};

const BeregningCells = ({ beregning, status }: SimulertBeregningDagMedBeregning) => {
    const beregnetDiffDag = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    return (
        <>
            <Table.DataCell className={style.statusIkon}>
                {ikonForMeldekortbehandlingDagStatus[status]}
            </Table.DataCell>
            <Table.DataCell>
                {kortStatusTekst[status] ?? meldekortbehandlingDagStatusTekst[status]}
            </Table.DataCell>
            <Table.DataCell>{beregning.ordinært.før}</Table.DataCell>
            <Table.DataCell>
                <strong>{beregning.ordinært.nå}</strong>
            </Table.DataCell>
            <Table.DataCell>{beregning.barnetillegg.før}</Table.DataCell>
            <Table.DataCell>
                <strong>{beregning.barnetillegg.nå}</strong>
            </Table.DataCell>
            <Table.DataCell>{beregning.totalt.før}</Table.DataCell>
            <Table.DataCell>
                <strong>{beregning.totalt.nå}</strong>
            </Table.DataCell>
            <Table.DataCell className={beløpStyle(beregnetDiffDag)}>
                {beregnetDiffDag}
            </Table.DataCell>
        </>
    );
};

/**
 * Kortversjoner for den tette beregningstabellen.
 * Full tekst brukes ellers i løsningen; her leser bare saksbehandlere, og plassen er knapp.
 */
const kortStatusTekst: PartialRecord<MeldekortbehandlingDagStatus, string> = {
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]: 'Ikke rett',
};

/**
 * Dagen sier bare hvilke posteringstyper som dekker den.
 * Beløp og perioder står i posteringslista per meldeperiode, så tabellen slipper å gjenta dem på hver dag.
 *
 * I meldeperioder uten beregning vises alle dagene i meldeperioden, slik at visningen er konsekvent med meldeperiodene som har beregning.
 * Dagene simuleringen ikke har posteringer på sier «Ingen simulering» i stedet for å stå tomme.
 */
const SimuleringsstatusCell = ({
    merker,
    harBeregning,
}: {
    merker: Simuleringsmerke[];
    harBeregning: boolean;
}) => {
    const kompakteMerker = tilKompakteMerker(merker);

    if (merker.length === 0 && !harBeregning) {
        return (
            <Table.DataCell>
                <BodyShort size={'small'} textColor={'subtle'}>
                    {'Ingen simulering'}
                </BodyShort>
            </Table.DataCell>
        );
    }

    return (
        <Table.DataCell>
            {kompakteMerker.length > 0 && (
                <HStack gap={'space-4'} align={'center'} wrap={false}>
                    {kompakteMerker.map(({ etikett, variant, antall }) => (
                        <Tag size={'xsmall'} variant={variant} key={etikett}>
                            {antall > 1 ? `${etikett}\u00A0×${antall}` : etikett}
                        </Tag>
                    ))}
                </HStack>
            )}
        </Table.DataCell>
    );
};
