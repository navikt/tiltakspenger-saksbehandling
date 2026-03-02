import { SøknadsbehandlingVedtak } from '~/components/behandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './context/BehandlingContext';
import { Rammebehandlingsstatus, Rammebehandlingstype } from '~/types/Rammebehandling';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert, Box, Heading, VStack } from '@navikt/ds-react';
import { finnBehandlingStatusTag, omgjøringsårsakTilText } from '~/utils/tekstformateringUtils';
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbrutt/OppsummeringAvAvbrutt';
import SideBarMain from '../../layouts/sidebar-main/SideBarMain';
import { Tidslinjer } from '~/components/tidslinjer/Tidslinjer';
import { useSak } from '~/context/sak/SakContext';
import OppsummeringAvVentestatus from '~/components/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { BehandlingSkjemaProvider } from '~/components/behandling/context/BehandlingSkjemaContext';
import { KlagebehandlingResultat } from '~/types/Klage';
import { OppsummeringsPar } from '../oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { PERSONOVERSIKT_TABS } from '~/components/personoversikt/Personoversikt';

import style from './BehandlingPage.module.css';

export const BehandlingPage = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const {
        id,
        sistEndret,
        type,
        sakId,
        saksnummer,
        status,
        avbrutt,
        ventestatus,
        saksopplysninger,
    } = behandling;

    return (
        <>
            <PersonaliaHeader
                sakId={sakId}
                saksnummer={saksnummer}
                visTilbakeKnapp={true}
                aktivTab={
                    status === Rammebehandlingsstatus.VEDTATT
                        ? PERSONOVERSIKT_TABS.vedtatteBehandlinger
                        : PERSONOVERSIKT_TABS.apneBehandlinger
                }
            >
                {finnBehandlingStatusTag(status, false, ventestatus?.erSattPåVent)}
            </PersonaliaHeader>

            {/*
            Veldig viktig at key ikke blir fjernet. På denne måten kan vi tvinge skjema-contextene til å rerendre seg når man bytter eller oppdaterer behandlingen.
            For eksempel ved å bruke 'Til behandling' lenken i SøknadOpplysningerFraVedtak komponenten.
            Uten denne keyen vil skjema-contextene beholde state fra forrige behandling, og dette kan føre til en error.

            Raskeste, og enkleste fiks uten å endre for mye på eksisterende kode.
            */}
            <BehandlingSkjemaProvider
                key={`${id}-${sistEndret}-${saksopplysninger.oppslagstidspunkt}`}
            >
                <SideBarMain
                    sidebar={<BehandlingSaksopplysninger />}
                    main={
                        <div className={style.main}>
                            {ventestatus && ventestatus.erSattPåVent && (
                                <OppsummeringAvVentestatus ventestatus={ventestatus} />
                            )}
                            <Tidslinjer sak={sak} />
                            {avbrutt && <AvbruttOppsummering avbrutt={avbrutt} withPanel={true} />}
                            <OppsummeringAvKlageForRammebehandling />
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

const OppsummeringAvKlageForRammebehandling = () => {
    const { behandling, klagebehandling } = useBehandling();

    if (!behandling.klagebehandlingId) {
        return null;
    }

    if (klagebehandling?.resultat?.type !== KlagebehandlingResultat.OMGJØR) {
        return (
            <Alert
                variant={'error'}
            >{`Forventet en tilknyttet klagebehandling med resultat 'OMGJØR' men fikk resultat: ${klagebehandling?.resultat?.type}`}</Alert>
        );
    }

    return (
        <Box background="default" padding="space-16">
            <Heading size="small">Informasjon fra klagen</Heading>
            <VStack gap="space-4">
                <OppsummeringsPar
                    retning="vertikal"
                    label="Årsak"
                    verdi={omgjøringsårsakTilText[klagebehandling.resultat.årsak]}
                />
                <OppsummeringsPar
                    retning="vertikal"
                    label="Begrunnelse"
                    verdi={klagebehandling.resultat.begrunnelse}
                />
            </VStack>
        </Box>
    );
};
