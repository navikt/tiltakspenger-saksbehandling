import { Ytelse } from '~/types/Ytelse';
import { VStack } from '@navikt/ds-react';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedFlerePerioder,
    BehandlingSaksopplysningMedPeriode,
} from '~/components/behandling/saksopplysninger/BehandlingSaksopplysning';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import styles from './BehandlingYtelserOpplysninger.module.css';

type Props = {
    ytelser: Ytelse[];
};

export const BehandlingYtelserOpplysninger = ({ ytelser }: Props) => {
    return (
        <VStack gap="2">
            {ytelser.map((ytelse) => (
                <div key={ytelse.ytelsetype}>
                    <YtelseOpplysning ytelse={ytelse} />
                </div>
            ))}
        </VStack>
    );
};

const YtelseOpplysning = (props: { ytelse: Ytelse }) => {
    const { ytelsetype, perioder } = props.ytelse;
    const flerePerioder = perioder.length > 1;

    return (
        <>
            <div className={styles.ytelsesopplysningVarsel}>
                <BehandlingSaksopplysning navn={'Type'} verdi={ytelsetype} />
                <ExclamationmarkTriangleFillIcon />
            </div>
            {!flerePerioder && (
                <BehandlingSaksopplysningMedPeriode navn={'Periode'} periode={perioder[0]} />
            )}
            {flerePerioder && (
                <BehandlingSaksopplysningMedFlerePerioder navn={'Perioder'} perioder={perioder} />
            )}
        </>
    );
};
