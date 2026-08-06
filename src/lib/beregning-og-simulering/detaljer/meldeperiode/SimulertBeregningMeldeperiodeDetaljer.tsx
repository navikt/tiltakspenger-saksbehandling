import { Table, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SimulertBeregningPerMeldeperiode } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { useState } from 'react';
import { SimuleringOppsummeringDetaljert } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/oppsummering/SimuleringOppsummeringDetaljert';
import { beløpStyle } from '~/lib/_felles/utbetaling/beløp/beløpStyle';
import { SimulertBeregningDagDetaljer } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/dag/SimulertBeregningDagDetaljer';
import { SimuleringDetaljerMeldeperiodeHeader } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/header/SimuleringDetaljerMeldeperiodeHeader';
import { SimuleringsflaggVarsler } from '~/lib/beregning-og-simulering/flagg/SimuleringsflaggVarsler';
import { SimuleringPosteringliste } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/posteringer/SimuleringPosteringliste';

import style from './SimulertBeregningMeldeperiodeDetaljer.module.css';

type Props = {
    meldeperiode: SimulertBeregningPerMeldeperiode;
    harSimulering: boolean;
};

/**
 * Én meldeperiode med header, dagtabell og simuleringsoppsummering.
 *
 * Header, flaggvarsler og oppsummering ligger utenfor scrollområdet, slik at de brekker på kortets bredde.
 * Bare dagtabellen skroller når den er bredere enn kortet — den skal aldri klippes stille.
 */
export const SimulertBeregningMeldeperiodeDetaljer = ({ meldeperiode, harSimulering }: Props) => {
    const [erÅpen, setErÅpen] = useState(false);

    const { dager, beregning, simulerteBeløp, flagg } = meldeperiode;
    const { totalt, ordinært, barnetillegg } = beregning;

    const beregnetDiff = totalt.nå - (totalt.før ?? 0);
    const simulertDiff = simulerteBeløp
        ? simulerteBeløp.nyUtbetaling - simulerteBeløp.tidligereUtbetaling
        : undefined;

    // Meldeperioden er alltid 14 dager fra mandag til søndag, og kjede-id-en bærer den.
    // Dagene i simuleringen kan være et kortere utsnitt (f.eks. bare dagene med posteringer), så de kan ikke brukes som periode.
    const [kjedeFraOgMed, kjedeTilOgMed] = meldeperiode.kjedeId.split('/');
    const periode = {
        fraOgMed: kjedeFraOgMed ?? dager.at(0)!.dato,
        tilOgMed: kjedeTilOgMed ?? dager.at(-1)!.dato,
    };

    return (
        <section>
            <div className={style.header}>
                <SimuleringDetaljerMeldeperiodeHeader
                    periode={periode}
                    beregnetDiff={beregnetDiff}
                    simulertDiff={simulertDiff}
                    flagg={flagg}
                    erÅpen={erÅpen}
                    setErÅpen={setErÅpen}
                />
            </div>

            {erÅpen && (
                <>
                    <div className={style.tabellScroll}>
                        <Table size={'small'}>
                            <Table.Header>
                                <Table.Row shadeOnHover={false} className={style.tabellHeaderOver}>
                                    <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>{'Status'}</Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>{'Ordinær'}</Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>
                                        {'Barnetillegg'}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>{'Totalt'}</Table.HeaderCell>
                                    <Table.HeaderCell colSpan={2}>{'Endring'}</Table.HeaderCell>
                                </Table.Row>
                                <Table.Row shadeOnHover={false} className={style.tabellHeaderUnder}>
                                    <Table.HeaderCell colSpan={3} />
                                    <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Beregnet'}</Table.HeaderCell>
                                    <Table.HeaderCell>{'Simulering'}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {dager.map((dag) => (
                                    <SimulertBeregningDagDetaljer
                                        dag={dag}
                                        harSimulering={harSimulering}
                                        key={dag.dato}
                                    />
                                ))}

                                <Table.Row className={style.periodeSum}>
                                    <Table.DataCell colSpan={3}>
                                        <strong>{'Sum for periode'}</strong>
                                    </Table.DataCell>
                                    <Table.DataCell>{ordinært.før}</Table.DataCell>
                                    <Table.DataCell>
                                        <strong>{ordinært.nå}</strong>
                                    </Table.DataCell>
                                    <Table.DataCell>{barnetillegg.før}</Table.DataCell>
                                    <Table.DataCell>
                                        <strong>{barnetillegg.nå}</strong>
                                    </Table.DataCell>
                                    <Table.DataCell>{totalt.før}</Table.DataCell>
                                    <Table.DataCell>
                                        <strong>{totalt.nå}</strong>
                                    </Table.DataCell>
                                    <Table.DataCell className={beløpStyle(beregnetDiff)}>
                                        <strong>{beregnetDiff}</strong>
                                    </Table.DataCell>
                                    <Table.DataCell className={beløpStyle(simulertDiff)}>
                                        <strong>{simulertDiff ?? '-'}</strong>
                                    </Table.DataCell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>

                    <div className={style.simuleringSeksjon}>
                        {harSimulering ? (
                            <VStack gap={'space-8'}>
                                <SimuleringsflaggVarsler flagg={[flagg]} />
                                <SimuleringPosteringliste posteringer={meldeperiode.posteringer} />
                                <SimuleringOppsummeringDetaljert
                                    headerTekst={'Simulering for hele perioden'}
                                    simulerteBeløp={meldeperiode.simulerteBeløp}
                                />
                            </VStack>
                        ) : (
                            <Infokort variant={'feil'} size={'small'}>
                                {'Simulering mangler'}
                            </Infokort>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};
