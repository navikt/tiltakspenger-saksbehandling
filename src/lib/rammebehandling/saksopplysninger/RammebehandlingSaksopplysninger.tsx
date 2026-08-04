import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst } from '~/utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { Separator } from '~/lib/_felles/separator/Separator';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';
import { BehandlingSaksopplysning } from './BehandlingSaksopplysning';
import { BehandlingTiltakOpplysninger } from './tiltak/BehandlingTiltakOpplysninger';
import OppsummeringAvAttesteringer from '~/lib/behandling-felles/attestering/OppsummeringAvAttestering';
import {
    fyller18ÅrISøknadsperioden,
    hentTiltaksperiode,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import { OppsummeringAvSøknad } from '~/lib/behandling-felles/oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad';
import { BehandlingYtelserOpplysninger } from '~/lib/rammebehandling/saksopplysninger/ytelser/BehandlingYtelserOpplysninger';
import { BehandlingTiltakspengerArenaOpplysninger } from '~/lib/rammebehandling/saksopplysninger/tiltakspenger-fra-arena/BehandlingTiltakspengerArenaOpplysninger';
import { Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadOpplysningerFraVedtak } from '~/lib/rammebehandling/saksopplysninger/søknad/SøknadOpplysningerFraVedtak';
import { useSak } from '~/lib/sak/SakContext';
import { RammebehandlingMeny } from '~/lib/rammebehandling/felles/meny/RammebehandlingMeny';
import { BehandlingStatusTags } from '~/lib/behandling-felles/status/BehandlingStatusTags';

import style from './RammebehandlingSaksopplysninger.module.css';

export const RammebehandlingSaksopplysninger = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { saksopplysninger, type, attesteringer } = behandling;
    const { ytelser, tiltakspengevedtakFraArena, tiltaksdeltagelse, fødselsdato } =
        saksopplysninger;

    return (
        <VStack className={style.container}>
            <BehandlingStatusTags behandling={behandling} className={style.status} />

            <HStack justify={'space-between'} gap={'space-8'}>
                <VStack>
                    <BehandlingSaksopplysning
                        navn="Saksbehandler"
                        verdi={behandling.saksbehandler ?? 'Ikke tildelt'}
                    />
                    <BehandlingSaksopplysning
                        navn="Beslutter"
                        verdi={behandling.beslutter ?? 'Ikke tildelt'}
                    />
                </VStack>

                <RammebehandlingMeny behandling={behandling} kallesFra={'behandling'} />
            </HStack>

            <Separator />

            <Heading size={'small'} level={'3'}>
                {'Saksopplysninger'}
            </Heading>
            <BehandlingOppdaterSaksopplysninger />

            <Separator />

            <OpplysningerSeksjon header={'Tiltak registrert på bruker'}>
                <BehandlingTiltakOpplysninger
                    tiltaksdeltakelser={tiltaksdeltagelse}
                    vurderingsperiode={saksopplysninger.periode}
                />
            </OpplysningerSeksjon>

            <Separator />

            <OpplysningerSeksjon header={'Andre ytelser'}>
                <BehandlingYtelserOpplysninger ytelser={ytelser} />
            </OpplysningerSeksjon>

            <Separator />

            <OpplysningerSeksjon header={'Tiltakspengevedtak fra Arena'}>
                <BehandlingTiltakspengerArenaOpplysninger vedtak={tiltakspengevedtakFraArena} />
            </OpplysningerSeksjon>

            <Separator />

            <OpplysningerSeksjon header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <BehandlingSaksopplysning
                    navn={'Fødselsdato'}
                    verdi={formaterDatotekst(fødselsdato)}
                />
                {fyller18ÅrISøknadsperioden(behandling, sak) && (
                    <BehandlingSaksopplysning
                        navn={'Fyller 18 i perioden bruker har søkt om'}
                        visVarsel
                    />
                )}
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
        </VStack>
    );
};

const OpplysningerSeksjon = ({ header, children }: { header: string; children: ReactNode }) => {
    return (
        <div>
            <Heading size={'small'} level={'3'} className={style.seksjonHeader}>
                {header}
            </Heading>
            {children}
        </div>
    );
};
