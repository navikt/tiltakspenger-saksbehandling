import { VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '~/components/behandling/saksopplysninger/BehandlingSaksopplysning';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import styles from './BehandlingTiltakspengerArenaOpplysninger.module.css';
import { ArenaTPVedtak } from '~/types/ArenaTPVedtak';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    vedtak: ArenaTPVedtak[];
};

export const BehandlingTiltakspengerArenaOpplysninger = ({ vedtak }: Props) => {
    return (
        <VStack gap="space-8">
            {vedtak.map((tpvedtak) => (
                <div key={`${tpvedtak.rettighet}-${tpvedtak.fraOgMed}`}>
                    <TiltakspengerArenaOpplysning vedtak={tpvedtak} />
                </div>
            ))}
        </VStack>
    );
};

const TiltakspengerArenaOpplysning = (props: { vedtak: ArenaTPVedtak }) => {
    const { fraOgMed, tilOgMed, rettighet } = props.vedtak;
    const tilOgMedTekst = tilOgMed ? formaterDatotekst(tilOgMed) : '';
    return (
        <>
            <div className={styles.tiltakspengerArenaOpplysningVarsel}>
                <BehandlingSaksopplysning navn={'Rettighet'} verdi={rettighet} />
                <ExclamationmarkTriangleFillIcon />
            </div>
            <BehandlingSaksopplysning
                navn={'Periode'}
                verdi={`${formaterDatotekst(fraOgMed)} - ${tilOgMedTekst}`}
            />
        </>
    );
};
