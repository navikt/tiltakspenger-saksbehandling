import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Heading, Link, VStack } from '@navikt/ds-react';
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
        <VStack gap={'space-32'}>
            <OmgjøringVedtaksperiodeVelger />

            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
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
                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst variant={'warning'}>
                        <Heading size={'small'}>{'Hva skal det stå her for opphør?'}</Heading>
                        {'Husk å vurdere om du må forhåndsvarsle bruker før du foretar et opphør.'}
                        {' Dette må gjøres via '}
                        <Link href={gosysUrl}>{'Gosys'}</Link> {' eller '}
                        <Link href={modiaPersonoversiktUrl}>{'Modia personoversikt.'}</Link>
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
        </VStack>
    );
};
