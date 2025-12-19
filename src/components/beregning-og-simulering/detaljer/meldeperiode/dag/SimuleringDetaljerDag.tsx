import { SimulertBeregningDag, SimulerteBeløp } from '~/types/SimulertBeregning';
import { BodyShort, Button, Table, Tooltip } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '~/components/meldekort/0-felles-komponenter/MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';
import { useState } from 'react';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { SimuleringOppsummeringDetaljert } from '~/components/beregning-og-simulering/detaljer/meldeperiode/oppsummering/SimuleringOppsummeringDetaljert';

import style from './SimuleringDetaljerDager.module.css';

type Props = {
    dag: SimulertBeregningDag;
    className?: string;
};

export const SimuleringDetaljerDag = ({ dag, className }: Props) => {
    const [visSimulering, setVisSimulering] = useState(false);

    const { beregning, simulerteBeløp, dato, status } = dag;

    const beregnetDiffDag = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    const harSimulering = simulerteBeløp !== null;

    const simulertDiffDag = harSimulering
        ? simulerteBeløp.nyUtbetaling - simulerteBeløp.tidligereUtbetaling
        : undefined;

    return (
        <>
            <Table.Row className={classNames(style.meldeperiodeDag, className)} key={dato}>
                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                <Table.DataCell className={style.statusIkon}>
                    {ikonForMeldekortBehandlingDagStatus[status]}
                </Table.DataCell>
                <Table.DataCell>{meldekortBehandlingDagStatusTekst[status]}</Table.DataCell>
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
                <Table.DataCell className={style.simuleringCell}>
                    {harSimulering ? (
                        <>
                            <span className={beløpStyle(simulertDiffDag)}>{simulertDiffDag}</span>
                            <Tooltip
                                content={`${visSimulering ? 'Skjul' : 'Vis'} detaljer for simulering av dagen`}
                            >
                                <Button
                                    variant={'tertiary'}
                                    size={'xsmall'}
                                    type={'button'}
                                    icon={visSimulering ? <MinusIcon /> : <PlusIcon />}
                                    onClick={() => setVisSimulering(!visSimulering)}
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <BodyShort size={'small'}>{'Ikke simulert'}</BodyShort>
                    )}
                </Table.DataCell>
            </Table.Row>
            {visSimulering && simulerteBeløp && <SimuleringRow simulerteBeløp={simulerteBeløp} />}
        </>
    );
};

const SimuleringRow = ({ simulerteBeløp }: { simulerteBeløp: SimulerteBeløp }) => {
    return (
        <Table.Row className={style.detaljerRow} shadeOnHover={false}>
            <Table.DataCell />
            <Table.DataCell colSpan={10}>
                <SimuleringOppsummeringDetaljert simulerteBeløp={simulerteBeløp} />
            </Table.DataCell>
        </Table.Row>
    );
};
