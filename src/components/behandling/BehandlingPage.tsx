import { SøknadsbehandlingVedtak } from '~/components/behandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './context/BehandlingContext';

import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert } from '@navikt/ds-react';
import { finnBehandlingStatusTag } from '~/utils/tekstformateringUtils';
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbruttBehandling/OppsummeringAvAvbruttBehandling';
import SideBarMain from '../../layouts/sidebar-main/SideBarMain';
import { BehandlingerTidslinje } from '~/components/behandling/tidslinje/BehandlingerTidslinje';
import { useSak } from '~/context/sak/SakContext';
import BehandlingSattPåVentOppsummering from '~/components/oppsummeringer/behandlingSattPåVent/OppsummeringBehandlingSattPåVent';
import { BehandlingSkjemaProvider } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BehandlingPage.module.css';
import { Rammebehandlingstype } from '~/types/Rammebehandling';

export const BehandlingPage = () => {
    const { sak } = useSak();
    const behandlingsContext = useBehandling();
    const { type, sakId, saksnummer, status, avbrutt, ventestatus } = behandlingsContext.behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                {finnBehandlingStatusTag(status, false, ventestatus?.erSattPåVent)}
            </PersonaliaHeader>

            {/* 
            Veldig viktig at key ikke blir fjernet. På denne måten kan vi tvinge skjema-contextene til å rerendre seg når man 'bytter' behandling. For exempel ved å bruke 'Til behandling' 
            lenken i SøknadOpplysningerFraVedtak komponenten. Uten denne keyen vil skjema-contextene beholde state fra forrige behandling, og dette vil føre til en error.

            Raskeste, og enkleste fiks uten å endre for mye på eksisterende kode.
            */}
            <BehandlingSkjemaProvider key={behandlingsContext.behandling.id}>
                <SideBarMain
                    sidebar={<BehandlingSaksopplysninger />}
                    main={
                        <div className={style.main}>
                            {ventestatus && ventestatus.erSattPåVent && (
                                <BehandlingSattPåVentOppsummering ventestatus={ventestatus} />
                            )}
                            <BehandlingerTidslinje sak={sak} />
                            {avbrutt && <AvbruttOppsummering avbrutt={avbrutt} withPanel={true} />}
                            <div className={style.vedtakContainer}>
                                {type === Rammebehandlingstype.SØKNADSBEHANDLING ? (
                                    <SøknadsbehandlingVedtak />
                                ) : type === Rammebehandlingstype.REVURDERING ? (
                                    <RevurderingVedtak />
                                ) : (
                                    <Alert
                                        variant={'error'}
                                    >{`Behandlingstypen er ikke implementert: ${type}`}</Alert>
                                )}
                            </div>
                        </div>
                    }
                />
            </BehandlingSkjemaProvider>
        </>
    );
};
