import { useRevurderingVedtak } from '../../RevurderingVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { useSendRevurderingVedtak } from '../useSendRevurderingVedtak';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import React from 'react';
import { TekstfeltMedMellomlagring } from '../../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBegrunnelseLagringDTO } from '../../../../../types/VedtakTyper';
import { VedtakHjelpetekst } from '../../../vedtak-layout/hjelpetekst/VedtakHjelpetekst';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '../../../../liste/TekstListe';

import style from './RevurderingStansBegrunnelse.module.css';

export const RevurderingStansBegrunnelse = () => {
    const revurderingVedtak = useRevurderingVedtak();
    const { begrunnelseRef } = revurderingVedtak;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { begrunnelseVilkårsvurdering, sakId, id } = behandling;

    const {} = useSendRevurderingVedtak(behandling, revurderingVedtak);

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.container}>
                <TekstfeltMedMellomlagring
                    hideLabel={false}
                    label={'Begrunnelse for stans'}
                    description={
                        'Ikke skriv personsensitiv informasjon som ikke er relevant for saken. Husk at bruker har rett til innsyn.'
                    }
                    defaultValue={begrunnelseVilkårsvurdering ?? ''}
                    readOnly={!erSaksbehandler}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/begrunnelse`}
                    lagringBody={(tekst) =>
                        ({ begrunnelse: tekst }) satisfies VedtakBegrunnelseLagringDTO
                    }
                    ref={begrunnelseRef}
                />
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Stans av tiltakspenger'}>
                    <BodyLong size={'small'}>{'Vurder hjemmel for stans og noter ned: '}</BodyLong>
                    <TekstListe
                        tekster={[
                            'Hvilke faktum som er lagt til grunn og hvordan regel er vurdert opp mot faktumet',
                            'Eventuelle kommentarer til beslutter',
                        ]}
                    />
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
