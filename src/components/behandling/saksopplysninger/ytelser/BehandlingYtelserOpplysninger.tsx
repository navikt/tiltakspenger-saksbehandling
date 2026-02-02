import { Ytelse } from '~/types/Ytelse';
import { BodyShort, Checkbox, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '~/components/behandling/saksopplysninger/BehandlingSaksopplysning';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './BehandlingYtelserOpplysninger.module.css';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { slåSammenPerioder } from '~/utils/periode';
import React, { useState } from 'react';

type Props = {
    ytelser: Ytelse[];
};

export const BehandlingYtelserOpplysninger = ({ ytelser }: Props) => {
    return (
        <VStack gap="space-8">
            {ytelser.map((ytelse) => {
                const { ytelsetype, perioder } = ytelse;
                const flerePerioder = perioder.length > 1;

                return (
                    <div key={ytelse.ytelsetype}>
                        <div className={styles.ytelsesopplysningVarsel}>
                            <BehandlingSaksopplysning navn={'Type'} verdi={ytelsetype} />
                            <ExclamationmarkTriangleFillIcon />
                        </div>
                        {flerePerioder ? (
                            <BehandlingSaksopplysningMedFlerePerioder perioder={perioder} />
                        ) : (
                            <BehandlingSaksopplysning
                                navn={'Periode'}
                                verdi={periodeTilFormatertDatotekst({
                                    tilOgMed: perioder[0].tilOgMed,
                                    fraOgMed: perioder[0].fraOgMed,
                                })}
                            />
                        )}
                    </div>
                );
            })}
        </VStack>
    );
};

export const BehandlingSaksopplysningMedFlerePerioder = ({ perioder }: { perioder: Periode[] }) => {
    const perioderSlåttSammen = slåSammenPerioder(perioder);
    const harSammenslåttePerioder = perioderSlåttSammen.length !== perioder.length;

    const [visSammenslått, setVisSammenslått] = useState(harSammenslåttePerioder);

    const perioderSomVises = visSammenslått ? perioderSlåttSammen : perioder;

    return (
        <VStack>
            {harSammenslåttePerioder && (
                <Checkbox
                    size={'small'}
                    checked={visSammenslått}
                    onChange={() => setVisSammenslått(!visSammenslått)}
                >
                    {'Vis sammenslåtte perioder'}
                </Checkbox>
            )}
            <BodyShort size={'small'}>{'Perioder:'}</BodyShort>
            <ul>
                {perioderSomVises.map((periode) => {
                    const periodeTekst = periodeTilFormatertDatotekst({
                        fraOgMed: periode.fraOgMed,
                        tilOgMed: periode.tilOgMed,
                    });

                    return <li key={periodeTekst}>{periodeTekst}</li>;
                })}
            </ul>
        </VStack>
    );
};
