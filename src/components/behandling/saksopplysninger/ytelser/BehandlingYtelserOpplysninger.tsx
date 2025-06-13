import { Ytelse } from '~/types/Ytelse';
import { VStack } from '@navikt/ds-react';
import {
    BehandlingSaksopplysning,
    BehandlingSaksopplysningMedFlerePerioder,
    BehandlingSaksopplysningMedPeriode,
} from '~/components/behandling/saksopplysninger/BehandlingSaksopplysning';

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
            <BehandlingSaksopplysning navn={'Type'} verdi={ytelsetype} />
            {!flerePerioder && (
                <BehandlingSaksopplysningMedPeriode navn={'Periode'} periode={perioder[0]} />
            )}
            {flerePerioder && (
                <BehandlingSaksopplysningMedFlerePerioder navn={'Perioder'} perioder={perioder} />
            )}
        </>
    );
};
