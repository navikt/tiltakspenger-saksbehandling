import { Ytelse } from '~/types/Ytelse';
import { BodyShort, Checkbox, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '~/components/behandling/saksopplysninger/BehandlingSaksopplysning';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './BehandlingYtelserOpplysninger.module.css';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { sorterPerioder, totalPeriode } from '~/utils/periode';
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
                            <YtelseMedFlerePerioder perioder={perioder} />
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

const YtelseMedFlerePerioder = ({ perioder }: { perioder: Periode[] }) => {
    const totalPeriodeForYtelse = totalPeriode(perioder);
    const antall = perioder.length;

    const sortertePerioder = perioder.toSorted(sorterPerioder());

    const [visAllePerioder, setVisAllePerioder] = useState(false);

    return (
        <VStack>
            <BodyShort
                size={'small'}
            >{`${periodeTilFormatertDatotekst(totalPeriodeForYtelse)} (${antall} perioder)`}</BodyShort>

            <Checkbox
                size={'small'}
                checked={visAllePerioder}
                onChange={() => setVisAllePerioder(!visAllePerioder)}
            >
                {'Vis enkelt-perioder'}
            </Checkbox>

            {visAllePerioder ? (
                <ul>
                    {sortertePerioder.map((periode) => {
                        const periodeTekst = periodeTilFormatertDatotekst({
                            fraOgMed: periode.fraOgMed,
                            tilOgMed: periode.tilOgMed,
                        });

                        return <li key={periodeTekst}>{periodeTekst}</li>;
                    })}
                </ul>
            ) : null}
        </VStack>
    );
};
