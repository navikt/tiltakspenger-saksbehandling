import { SøknadsbehandlingVedtak } from '~/components/behandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { BehandlingSaksopplysninger } from './saksopplysninger/BehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './context/BehandlingContext';
import { Rammebehandlingstype } from '~/types/Rammebehandling';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert, Box, Heading, VStack } from '@navikt/ds-react';
import { finnBehandlingStatusTag, omgjøringsårsakTilText } from '~/utils/tekstformateringUtils';
import AvbruttOppsummering from '../oppsummeringer/oppsummeringAvAvbrutt/OppsummeringAvAvbrutt';
import SideBarMain from '../../layouts/sidebar-main/SideBarMain';
import { Tidslinjer } from '~/components/tidslinjer/Tidslinjer';
import { useSak } from '~/context/sak/SakContext';
import OppsummeringAvVentestatus from '~/components/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { BehandlingSkjemaProvider } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BehandlingPage.module.css';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';
import { OppsummeringsPar } from '../oppsummeringer/oppsummeringspar/OppsummeringsPar';

export const BehandlingPage = (props: { klage: Nullable<Klagebehandling> }) => {
    const { sak } = useSak();
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
    } = useBehandling().behandling;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true}>
                {finnBehandlingStatusTag(status, false, ventestatus?.erSattPåVent)}
            </PersonaliaHeader>

            {/* 
            Veldig viktig at key ikke blir fjernet. På denne måten kan vi tvinge skjema-contextene til å rerendre seg når man bytter eller oppdaterer behandlingen.
            For exempel ved å bruke 'Til behandling' lenken i SøknadOpplysningerFraVedtak komponenten.
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
                            {props.klage && (
                                <OppsummeringAvKlageForRammebehandling klage={props.klage} />
                            )}
                            <div className={style.vedtakContainer}>
                                {type === Rammebehandlingstype.SØKNADSBEHANDLING ? (
                                    <SøknadsbehandlingVedtak klagebehandling={props.klage} />
                                ) : type === Rammebehandlingstype.REVURDERING ? (
                                    <RevurderingVedtak klage={props.klage} />
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

const OppsummeringAvKlageForRammebehandling = (props: { klage: Klagebehandling }) => {
    return (
        <Box background="default" padding="space-16">
            <Heading size="small">Informasjon fra klagen</Heading>
            <VStack gap="space-4">
                <OppsummeringsPar
                    retning="vertikal"
                    label="Årsak"
                    verdi={omgjøringsårsakTilText[props.klage.årsak!]}
                />
                <OppsummeringsPar
                    retning="vertikal"
                    label="Begrunnelse"
                    verdi={props.klage.begrunnelse}
                />
            </VStack>
        </Box>
    );
};
