import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingInnvilgelseBrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { Vedtaksbrev } from '~/components/behandling/felles/vedtaksbrev/Vedtaksbrev';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { useSak } from '~/context/sak/SakContext';

export const RevurderingInnvilgelseBrev = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    const { brevtekst } = vedtak.textAreas;

    return (
        <Vedtaksbrev
            header={'Vedtaksbrev for revurdering av innvilgelse'}
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={brevtekst.ref}
            validering={revurderingInnvilgelseValidering(sak, behandling, vedtak)}
            hentDto={(): RevurderingInnvilgelseBrevForhåndsvisningDTO => ({
                resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
                fritekst: brevtekst.get(),
                virkningsperiode: vedtak.behandlingsperiode,
                barnetillegg: vedtak.harBarnetillegg ? vedtak.barnetilleggPerioder : null,
            })}
            hjelpetekst={
                <div>
                    <p>{'Skal vi ha en egen hjelpetekst for denne?'}</p>
                </div>
            }
        />
    );
};
