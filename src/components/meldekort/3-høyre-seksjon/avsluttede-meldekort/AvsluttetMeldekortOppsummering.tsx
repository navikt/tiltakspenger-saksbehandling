import { HStack, VStack } from '@navikt/ds-react';
import { formaterTidspunkt } from '../../../../utils/date';
import { MeldekortBehandlingProps } from '../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../0-felles-komponenter/uker/MeldekortUker';
import { MeldekortBeregningOppsummering } from '../../0-felles-komponenter/beregning-oppsummering/MeldekortBeregningOppsummering';
import { MeldekortBegrunnelse } from '../../0-felles-komponenter/begrunnelse/MeldekortBegrunnelse';
import { OppsummeringsPar } from '../../../oppsummeringer/oppsummeringspar/OppsummeringsPar';
import React from 'react';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const AvsluttetMeldekortOppsummering = ({ meldekortBehandling }: Props) => {
    const { beregning, begrunnelse, dager, avbrutt } = meldekortBehandling;

    return (
        avbrutt && (
            <VStack gap={'5'}>
                <HStack gap="6">
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
                <MeldekortBeregningOppsummering meldekortBehandling={meldekortBehandling} />
                {begrunnelse && <MeldekortBegrunnelse readOnly={true} defaultValue={begrunnelse} />}
            </VStack>
        )
    );
};
