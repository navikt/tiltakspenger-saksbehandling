import { dateTilISOTekst, datoMin } from '~/utils/date';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useBehandlingInnvilgelseSkjemaDispatch,
    useBehandlingInnvilgelseSkjema,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';
import { hentHeleTiltaksdeltagelsesperioden } from '~/utils/behandling';
import { useSak } from '~/context/sak/SakContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Heading } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

export const InnvilgelsesperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelsesperiode } = useBehandlingInnvilgelseSkjema().innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    const tiltaksdeltagelsesperiode = hentHeleTiltaksdeltagelsesperioden(behandling);
    const defaultDato = datoMin(new Date(), tiltaksdeltagelsesperiode.tilOgMed);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperiode'}
                </Heading>
                <PeriodeVelger
                    fraOgMed={{
                        label: 'Fra og med',
                        value: innvilgelsesperiode.fraOgMed,
                        minDate: tiltaksdeltagelsesperiode.fraOgMed,
                        maxDate: innvilgelsesperiode.tilOgMed ?? tiltaksdeltagelsesperiode.tilOgMed,
                        defaultMonth: defaultDato,
                        error: !innvilgelsesperiode.fraOgMed && 'Velg dato',
                        onDateChange: (valgtDato) => {
                            if (!valgtDato) {
                                return;
                            }

                            dispatch({
                                type: 'oppdaterInnvilgelsesperiode',
                                payload: {
                                    periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                                    behandling,
                                    sak,
                                },
                            });
                        },
                    }}
                    tilOgMed={{
                        label: 'Til og med',
                        value: innvilgelsesperiode.tilOgMed,
                        minDate: innvilgelsesperiode.fraOgMed ?? tiltaksdeltagelsesperiode.fraOgMed,
                        maxDate: tiltaksdeltagelsesperiode.tilOgMed,
                        defaultMonth: defaultDato,
                        error: !innvilgelsesperiode.tilOgMed && 'Velg dato',
                        onDateChange: (valgtDato) => {
                            if (!valgtDato) {
                                return;
                            }

                            dispatch({
                                type: 'oppdaterInnvilgelsesperiode',
                                payload: {
                                    periode: { tilOgMed: dateTilISOTekst(valgtDato) },
                                    behandling,
                                    sak,
                                },
                            });
                        },
                    }}
                    readOnly={erIkkeSaksbehandler}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
