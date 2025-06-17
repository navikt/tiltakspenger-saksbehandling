import { BodyLong, Heading } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { useSøknadsbehandlingSkjema } from '../context/SøknadsbehandlingVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak-layout/hjelpetekst/VedtakHjelpetekst';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBrevFritekstLagringDTO } from '~/types/VedtakTyper';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { TekstListe } from '../../../liste/TekstListe';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';

import style from './SøknadsbehandlingBrev.module.css';

export const SøknadsbehandlingBrev = () => {
    const { behandling, rolleForBehandling } = useSøknadsbehandling();
    const { fritekstTilVedtaksbrev, sakId, id } = behandling;

    const { brevtekstRef, resultat, avslagsgrunner } = useSøknadsbehandlingSkjema();

    return (
        <VedtakSeksjon>
            {(resultat === SøknadsbehandlingResultat.INNVILGELSE ||
                (SøknadsbehandlingResultat.AVSLAG && avslagsgrunner !== null)) && (
                <>
                    <VedtakSeksjon.Venstre>
                        <Heading size={'xsmall'} level={'2'}>
                            {'Vedtaksbrev for tiltakspenger og barnetillegg'}
                        </Heading>
                        <BodyLong size={'small'}>
                            {'Teksten vises i vedtaksbrevet til bruker.'}
                        </BodyLong>
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
                            minRows={10}
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
                </>
            )}
        </VedtakSeksjon>
    );
};
