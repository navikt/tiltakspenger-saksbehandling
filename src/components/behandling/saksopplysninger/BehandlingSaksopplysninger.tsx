import { BodyShort, Heading } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst } from '~/utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { Separator } from '../../separator/Separator';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';
import { BehandlingSaksopplysning } from './BehandlingSaksopplysning';
import { BehandlingTiltakOpplysninger } from './tiltak/BehandlingTiltakOpplysninger';
import OppsummeringAvAttesteringer from '../../attestering/OppsummeringAvAttestering';
import { hentTiltaksperiode } from '~/utils/behandling';
import OppsummeringAvSøknad from '../../oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad';
import { BehandlingYtelserOpplysninger } from '~/components/behandling/saksopplysninger/ytelser/BehandlingYtelserOpplysninger';

import style from './BehandlingSaksopplysninger.module.css';
import { BehandlingTiltakspengerArenaOpplysninger } from '~/components/behandling/saksopplysninger/tiltakspenger-fra-arena/BehandlingTiltakspengerArenaOpplysninger';
import { Rammebehandlingstype } from '~/types/Behandling';

export const BehandlingSaksopplysninger = () => {
    const { behandling, rolleForBehandling } = useBehandling();
    const { saksopplysninger, type } = behandling;
    const harYtelser = saksopplysninger?.ytelser && saksopplysninger?.ytelser.length > 0;
    const harTiltakspengevedtakFraArena =
        saksopplysninger?.tiltakspengevedtakFraArena &&
        saksopplysninger?.tiltakspengevedtakFraArena.length > 0;

    return (
        <>
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <BehandlingOppdaterSaksopplysninger />
            )}
            {(saksopplysninger?.tiltaksdeltagelse?.length ?? 0) > 0 && (
                <OpplysningerSeksjon header={'Tiltak registrert på bruker'}>
                    <BehandlingTiltakOpplysninger
                        tiltaksdeltagelse={saksopplysninger!.tiltaksdeltagelse}
                    />
                    <Separator />
                </OpplysningerSeksjon>
            )}

            <OpplysningerSeksjon header={'Andre ytelser'}>
                {!harYtelser && <BodyShort size={'small'}>Ingen relevante ytelser</BodyShort>}
                {harYtelser && <BehandlingYtelserOpplysninger ytelser={saksopplysninger.ytelser} />}
                <Separator />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Tiltakspengevedtak fra Arena'}>
                {!harTiltakspengevedtakFraArena && (
                    <BodyShort size={'small'}>Ingen relevante tiltakspengevedtak i Arena</BodyShort>
                )}
                {harTiltakspengevedtakFraArena && (
                    <BehandlingTiltakspengerArenaOpplysninger
                        vedtak={saksopplysninger.tiltakspengevedtakFraArena}
                    />
                )}
                <Separator />
            </OpplysningerSeksjon>

            {saksopplysninger?.fødselsdato && (
                <OpplysningerSeksjon header={'Alder'}>
                    <BodyShort
                        weight={'semibold'}
                    >{`${alderFraDato(saksopplysninger.fødselsdato)} år`}</BodyShort>
                    <BehandlingSaksopplysning
                        navn={'Fødselsdato'}
                        verdi={formaterDatotekst(saksopplysninger.fødselsdato)}
                    />
                </OpplysningerSeksjon>
            )}
            {type === Rammebehandlingstype.SØKNADSBEHANDLING && (
                <>
                    <Separator />
                    <OpplysningerSeksjon header={'Fra søknad'}>
                        <OppsummeringAvSøknad
                            tiltaksperiode={hentTiltaksperiode(behandling)}
                            søknad={behandling.søknad}
                        />
                    </OpplysningerSeksjon>
                </>
            )}
            {behandling.attesteringer.length > 0 && (
                <>
                    <Separator />
                    <OppsummeringAvAttesteringer attesteringer={behandling.attesteringer} />
                </>
            )}
        </>
    );
};

const OpplysningerSeksjon = ({ header, children }: { header: string; children: ReactNode }) => {
    return (
        <div>
            <Heading size={'small'} level={'3'} className={style.header}>
                {header}
            </Heading>
            {children}
        </div>
    );
};
