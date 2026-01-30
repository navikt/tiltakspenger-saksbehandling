import { BodyShort, Heading } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst } from '~/utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { Separator } from '../../separator/Separator';
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

export const BehandlingSaksopplysninger = () => {
    const { behandling } = useBehandling();

    const { saksopplysninger, type, attesteringer } = behandling;
    const { ytelser, tiltakspengevedtakFraArena, tiltaksdeltagelse, fødselsdato } =
        saksopplysninger;

    const harYtelser = ytelser.length > 0;
    const harTiltakspengevedtakFraArena = tiltakspengevedtakFraArena.length > 0;
    const harTiltaksdeltakelse = tiltaksdeltagelse.length > 0;

    return (
        <>
            <BehandlingSaksopplysning
                navn="Saksbehandler"
                verdi={behandling.saksbehandler ?? 'Ikke tildelt'}
            />
            <BehandlingSaksopplysning
                navn="Beslutter"
                verdi={behandling?.beslutter ?? 'Ikke tildelt'}
            />
            <Separator />
            <Heading size={'small'} level={'3'}>
                {'Saksopplysninger'}
            </Heading>
            <BehandlingOppdaterSaksopplysninger />
            <Separator />

            <OpplysningerSeksjon header={'Tiltak registrert på bruker'}>
                {harTiltaksdeltakelse ? (
                    <BehandlingTiltakOpplysninger tiltaksdeltakelser={tiltaksdeltagelse} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante tiltaksdeltakelser</BodyShort>
                )}
                <Separator />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Andre ytelser'}>
                {harYtelser ? (
                    <BehandlingYtelserOpplysninger ytelser={ytelser} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante ytelser</BodyShort>
                )}
                <Separator />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Tiltakspengevedtak fra Arena'}>
                {harTiltakspengevedtakFraArena ? (
                    <BehandlingTiltakspengerArenaOpplysninger vedtak={tiltakspengevedtakFraArena} />
                ) : (
                    <BodyShort size={'small'}>Ingen relevante tiltakspengevedtak i Arena</BodyShort>
                )}
                <Separator />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <BehandlingSaksopplysning
                    navn={'Fødselsdato'}
                    verdi={formaterDatotekst(fødselsdato)}
                />
            </OpplysningerSeksjon>

            <Separator />

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
                    <Separator />
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
