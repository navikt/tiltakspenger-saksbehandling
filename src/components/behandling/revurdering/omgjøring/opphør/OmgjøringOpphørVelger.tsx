import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Link } from '@navikt/ds-react';
import { useConfig } from '~/context/ConfigContext';
import { StansOgOpphørHjemmelVelger } from '~/components/behandling/revurdering/felles/opphør-hjemmel-velger/StansOgOpphørHjemmelVelger';
import {
    useOmgjøringOpphørSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { OmgjøringVedtaksperiodeVelger } from '~/components/behandling/revurdering/omgjøring/vedtaksperiode/OmgjøringVedtaksperiodeVelger';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

export const OmgjøringOpphørVelger = () => {
    const { valgteHjemler } = useOmgjøringOpphørSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const { gosysUrl, modiaPersonoversiktUrl } = useConfig();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-24'}>
                <OmgjøringVedtaksperiodeVelger />

                <StansOgOpphørHjemmelVelger
                    label={'Hjemmel for opphør'}
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
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
