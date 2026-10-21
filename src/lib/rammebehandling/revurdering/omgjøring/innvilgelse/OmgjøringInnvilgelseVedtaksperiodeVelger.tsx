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
                        ' Perioden kan gå over flere vedtak, og alle gjeldende vedtak som overlapper perioden blir omgjort.'
                    }
                    {
                        ' Ved innvilgelse kan du også forlenge vedtaksperioden utover de gjeldende vedtaksperiodene.'
                    }
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
