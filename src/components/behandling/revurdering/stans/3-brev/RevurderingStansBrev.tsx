import { useRevurderingVedtak } from '../../RevurderingVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { useSendRevurderingVedtak } from '../useSendRevurderingVedtak';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import React from 'react';
import { TekstfeltMedMellomlagring } from '../../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBegrunnelseLagringDTO } from '../../../../../types/VedtakTyper';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';

export const RevurderingStansBrev = () => {
    const revurderingVedtak = useRevurderingVedtak();
    const { brevtekstRef } = revurderingVedtak;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { sakId, id } = behandling;

    const {} = useSendRevurderingVedtak(behandling, revurderingVedtak);

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <TekstfeltMedMellomlagring
                    hideLabel={false}
                    label={'Fritekst til brev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={''}
                    readOnly={!erSaksbehandler}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/begrunnelse`}
                    lagringBody={(tekst) =>
                        ({ begrunnelse: tekst }) satisfies VedtakBegrunnelseLagringDTO
                    }
                    ref={brevtekstRef}
                />
                <VedtaksbrevForhåndsvisning />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
