import { BodyShort, Heading } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst } from '~/utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';
import { BehandlingSaksopplysning } from './BehandlingSaksopplysning';
import { BehandlingTiltakOpplysninger } from './tiltak/BehandlingTiltakOpplysninger';
import OppsummeringAvAttesteringer from '../../attestering/OppsummeringAvAttestering';
import { hentTiltaksperiode } from '~/utils/behandling';
import { OppsummeringAvSøknad } from '../../oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad';
import { BehandlingYtelserOpplysninger } from '~/components/behandling/saksopplysninger/ytelser/BehandlingYtelserOpplysninger';
import { BehandlingTiltakspengerArenaOpplysninger } from '~/components/behandling/saksopplysninger/tiltakspenger-fra-arena/BehandlingTiltakspengerArenaOpplysninger';
import { Rammebehandlingstype } from '~/types/Rammebehandling';
import { SøknadOpplysningerFraVedtak } from '~/components/behandling/saksopplysninger/søknad/SøknadOpplysningerFraVedtak';

import style from './BehandlingSaksopplysninger.module.css';
import Divider from '~/components/divider/Divider';

export const BehandlingSaksopplysninger = () => {
    const { behandling } = useBehandling();

    const { saksopplysninger, type, attesteringer } = behandling;
    const { ytelser, tiltakspengevedtakFraArena, tiltaksdeltagelse, fødselsdato } =
        saksopplysninger;

    const harYtelser = ytelser.length > 0;
    const harTiltakspengevedtakFraArena = tiltakspengevedtakFraArena.length > 0;
    const harTiltaksdeltagelse = tiltaksdeltagelse.length > 0;

    return (
        <>
            <Heading size={'small'} level={'3'}>
                {'Saksopplysninger'}
            </Heading>
            <BehandlingOppdaterSaksopplysninger />
            <Divider color="black" margin="1.25rem 0" />

            <OpplysningerSeksjon header={'Tiltak registrert på bruker'}>
                {harTiltaksdeltagelse ? (
                    <BehandlingTiltakOpplysninger tiltaksdeltagelse={tiltaksdeltagelse} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante tiltaksdeltagelser</BodyShort>
                )}
                <Divider color="black" margin="1.25rem 0" />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Andre ytelser'}>
                {harYtelser ? (
                    <BehandlingYtelserOpplysninger ytelser={ytelser} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante ytelser</BodyShort>
                )}
                <Divider color="black" margin="1.25rem 0" />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Tiltakspengevedtak fra Arena'}>
                {harTiltakspengevedtakFraArena ? (
                    <BehandlingTiltakspengerArenaOpplysninger vedtak={tiltakspengevedtakFraArena} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante tiltakspengevedtak i Arena</BodyShort>
                )}
                <Divider color="black" margin="1.25rem 0" />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <BehandlingSaksopplysning
                    navn={'Fødselsdato'}
                    verdi={formaterDatotekst(fødselsdato)}
                />
            </OpplysningerSeksjon>

            <Divider color="black" margin="1.25rem 0" />

            {type === Rammebehandlingstype.SØKNADSBEHANDLING ? (
                <OpplysningerSeksjon header={'Fra søknad'}>
                    <OppsummeringAvSøknad
                        tiltaksperiode={hentTiltaksperiode(behandling)}
                        søknad={behandling.søknad}
                    />
                </OpplysningerSeksjon>
            ) : (
                <OpplysningerSeksjon header={'Tidligere innvilgede søknader'}>
                    <SøknadOpplysningerFraVedtak behandling={behandling} />
                </OpplysningerSeksjon>
            )}

            {attesteringer.length > 0 && (
                <>
                    <Divider color="black" margin="1.25rem 0" />
                    <OppsummeringAvAttesteringer attesteringer={attesteringer} />
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
