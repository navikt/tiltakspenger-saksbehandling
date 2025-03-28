import { BodyShort, Heading } from '@navikt/ds-react';
import { alderFraDato, formaterDatotekst } from '../../../utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../BehandlingContext';
import { Separator } from '../../separator/Separator';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';
import { BehandlingSøknadOpplysninger } from './søknad/BehandlingSøknadOpplysninger';
import { BehandlingSaksopplysning } from './BehandlingSaksopplysning';
import { Behandlingstype } from '../../../types/BehandlingTypes';
import { BehandlingTiltakOpplysninger } from './tiltak/BehandlingTiltakOpplysninger';

import style from './BehandlingSaksopplysninger.module.css';
import OppsummeringAvAttesteringer from '../../attestering/OppsummeringAvAttestering';

export const BehandlingSaksopplysninger = () => {
    const { behandling, rolleForBehandling } = useBehandling();
    const { saksopplysninger, type } = behandling;
    const { tiltaksdeltagelse, fødselsdato } = saksopplysninger;

    return (
        <div className={style.saksopplysninger}>
            <OpplysningerSeksjon header={'Tiltak registrert på bruker'}>
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <BehandlingOppdaterSaksopplysninger />
                )}
                <BehandlingTiltakOpplysninger tiltaksdeltagelse={tiltaksdeltagelse} />
                <Separator />
            </OpplysningerSeksjon>

            <OpplysningerSeksjon header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <BehandlingSaksopplysning
                    navn={'Fødselsdato'}
                    verdi={formaterDatotekst(fødselsdato)}
                />
            </OpplysningerSeksjon>
            {type === Behandlingstype.FØRSTEGANGSBEHANDLING && (
                <div>
                    <Separator />
                    <OpplysningerSeksjon header={'Fra søknad'}>
                        <BehandlingSøknadOpplysninger behandling={behandling} />
                    </OpplysningerSeksjon>
                </div>
            )}
            {behandling.attesteringer.length > 0 && (
                <div>
                    <Separator />
                    <OppsummeringAvAttesteringer attesteringer={behandling.attesteringer} />
                </div>
            )}
        </div>
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
