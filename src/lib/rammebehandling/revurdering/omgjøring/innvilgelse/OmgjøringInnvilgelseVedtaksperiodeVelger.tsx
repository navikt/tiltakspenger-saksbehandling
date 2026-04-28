import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { OmgjøringVedtaksperiodeVelger } from '~/lib/rammebehandling/revurdering/omgjøring/vedtaksperiode/OmgjøringVedtaksperiodeVelger';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

export const OmgjøringInnvilgelseVedtaksperiodeVelger = () => {
    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <OmgjøringVedtaksperiodeVelger />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Velg ny vedtaksperiode'}>
                    {'Du kan omgjøre hele eller deler av de gjeldende vedtaksperiodene.'}
                    {
                        ' Ved innvilgelse kan du forlenge vedtaksperioden utover det opprinnelige vedtaket, så lenge det ikke overlapper med andre gjeldende vedtak.'
                    }
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
