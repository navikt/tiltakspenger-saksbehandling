import { BodyLong, Heading } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak-layout/hjelpetekst/VedtakHjelpetekst';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBrevFritekstLagringDTO } from '../../../../types/VedtakTyper';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { TekstListe } from '../../../liste/TekstListe';
import { useFørstegangsbehandling } from '../../BehandlingContext';

import style from './FørstegangsVedtakBrev.module.css';

export const FørstegangsVedtakBrev = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { fritekstTilVedtaksbrev, sakId, id } = behandling;

    const { brevtekstRef } = useFørstegangsVedtakSkjema();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
                    {'Vedtaksbrev for tiltakspenger og barnetillegg'}
                </Heading>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <TekstfeltMedMellomlagring
                    label={'Tekst til vedtaksbrev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/fritekst`}
                    lagringBody={(tekst) =>
                        ({ fritekst: tekst }) satisfies VedtakBrevFritekstLagringDTO
                    }
                    ref={brevtekstRef}
                />
                <VedtaksbrevForhåndsvisning />
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Tekst i brev'}>
                    <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
                    <TekstListe
                        tekster={[
                            'Tiltaket de har fått godkjent tiltakspenger for og perioden det gjelder',
                            'Om det er noe som reduserer retten i deler av perioden de har søkt på',
                            'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet',
                        ]}
                    />
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
