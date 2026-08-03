import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { revurderingStansValidering } from '../revurderingStansValidering';
import { RammebehandlingHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingHandlinger';
import { useHentBehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import {
    RevurderingResultat,
    OppdaterRevurderingStansDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    RevurderingStansContext,
    useRevurderingStansSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';

export const RevurderingStansHandlinger = () => {
    const skjema = useRevurderingStansSkjema();
    const { behandling } = useRevurderingBehandling();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: () => revurderingStansValidering(skjema),
    });

    return <RammebehandlingHandlinger behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: RevurderingStansContext): OppdaterRevurderingStansDTO => {
    return {
        resultat: RevurderingResultat.STANS,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        valgteHjemler: skjema.hjemlerForStans!,
        ...(skjema.harValgtStansFraFørsteDagSomGirRett
            ? {
                  stansFraOgMed: null,
                  harValgtStansFraFørsteDagSomGirRett: true,
              }
            : {
                  stansFraOgMed: skjema.fraDato!,
                  harValgtStansFraFørsteDagSomGirRett: false,
              }),
        skalSendeVedtaksbrev: skjema.skalSendeVedtaksbrev,
    };
};
