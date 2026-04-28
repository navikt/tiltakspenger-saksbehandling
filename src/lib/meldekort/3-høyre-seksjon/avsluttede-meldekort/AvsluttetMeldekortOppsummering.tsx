import { HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { MeldekortbehandlingProps } from '~/types/meldekort/Meldekortbehandling';
import { MeldekortUker } from '../../0-felles-komponenter/uker/MeldekortUker';
import { MeldekortBegrunnelse } from '../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import { OppsummeringsPar } from '../../../oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { MeldekortBeregningOgSimulering } from '~/lib/meldekort/0-felles-komponenter/beregning-simulering/MeldekortBeregningOgSimulering';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const AvsluttetMeldekortOppsummering = ({ meldekortbehandling }: Props) => {
    const { beregning, begrunnelse, dager, avbrutt } = meldekortbehandling;

    return (
        avbrutt && (
            <VStack gap={'space-20'}>
                <HStack gap="space-24">
                    <OppsummeringsPar
                        label={'Avsluttet av'}
                        verdi={avbrutt.avbruttAv}
                        retning="vertikal"
                    />
                    <OppsummeringsPar
                        label={'Tidspunkt avsluttet'}
                        verdi={formaterTidspunkt(avbrutt.avbruttTidspunkt)}
                        retning="vertikal"
                    />
                </HStack>
                <OppsummeringsPar
                    label={'Begrunnelse'}
                    verdi={avbrutt.begrunnelse}
                    retning="vertikal"
                />
                <MeldekortUker dager={beregning?.beregningForMeldekortetsPeriode.dager ?? dager} />
                <MeldekortBeregningOgSimulering meldekortbehandling={meldekortbehandling} />
                {begrunnelse && <MeldekortBegrunnelse readOnly={true} defaultValue={begrunnelse} />}
            </VStack>
        )
    );
};
