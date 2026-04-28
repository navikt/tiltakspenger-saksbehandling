import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Link } from '@navikt/ds-react';
import { useConfig } from '~/context/ConfigContext';
import { StansOgOpphørHjemmelVelger } from '~/lib/rammebehandling/revurdering/felles/hjemmel-velger/StansOgOpphørHjemmelVelger';
import {
    useOmgjøringOpphørSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { OmgjøringVedtaksperiodeVelger } from '~/lib/rammebehandling/revurdering/omgjøring/vedtaksperiode/OmgjøringVedtaksperiodeVelger';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { HjemmelForOpphør } from '~/types/Revurdering';

export const OmgjøringOpphørVelger = () => {
    const { valgteHjemler } = useOmgjøringOpphørSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const { gosysUrl, modiaPersonoversiktUrl } = useConfig();

    const måHaFritekst = valgteHjemler.some((hjemmel) =>
        hjemlerForOpphørSomMåHaFritekst.has(hjemmel),
    );

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-24'}>
                <OmgjøringVedtaksperiodeVelger />

                <StansOgOpphørHjemmelVelger
                    label={'Hjemmel for opphør'}
                    aktuelleHjemler={hjemlerForOpphør}
                    valgteHjemler={valgteHjemler}
                    onChange={(hjemler) =>
                        dispatch({
                            type: 'setHjemlerForOpphør',
                            payload: { hjemler },
                        })
                    }
                />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre gap={'space-16'}>
                <VedtakHjelpetekst header={'Velg periode for opphør'}>
                    {'Du kan opphøre hele eller deler av de gjeldende innvilgelsesperiodene.'}
                    {' Opphørsperioden må starte og slutte innenfor innvilgelsesperiodene.'}
                </VedtakHjelpetekst>

                <VedtakHjelpetekst variant={'warning'}>
                    {'Husk å vurdere om du må forhåndsvarsle bruker før du foretar et opphør.'}
                    {' Dette må gjøres via '}
                    <Link href={gosysUrl}>{'Gosys'}</Link> {' eller '}
                    <Link href={modiaPersonoversiktUrl}>{'Modia personoversikt.'}</Link>
                </VedtakHjelpetekst>

                {måHaFritekst && (
                    <VedtakHjelpetekst variant={'warning'}>
                        {'Valgt hjemmel for må begrunnes med fritekst'}
                    </VedtakHjelpetekst>
                )}
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};

const hjemlerForOpphør: HjemmelForOpphør[] = Object.values(HjemmelForOpphør);

export const hjemlerForOpphørSomMåHaFritekst: ReadonlySet<HjemmelForOpphør> = new Set([
    HjemmelForOpphør.FremmetForSent,
    HjemmelForOpphør.Alder,
]);
