import { BodyShort, Heading } from '@navikt/ds-react';
import { alderFraDato } from '../../../utils/date';
import { ReactNode } from 'react';
import { useBehandling } from '../BehandlingContext';
import { Separator } from '../../separator/Separator';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BehandlingOppdaterSaksopplysninger } from './oppdater-saksopplysninger/BehandlingOppdaterSaksopplysninger';
import { BehandlingSøknadOpplysninger } from './søknad/BehandlingSøknadOpplysninger';
import { BehandlingSaksopplysning } from './BehandlingSaksopplysning';
import { Behandlingstype } from '../../../types/BehandlingTypes';

import style from './BehandlingSaksopplysninger.module.css';
import { BehandlingTiltakOpplysninger } from './tiltak/BehandlingTiltakOpplysninger';

export const BehandlingSaksopplysninger = () => {
    const { behandling, rolleForBehandling } = useBehandling();
    const { saksopplysninger, behandlingstype } = behandling;
    const { tiltaksdeltagelse, fødselsdato } = saksopplysninger;

    return (
        <div className={style.saksopplysninger}>
            <OpplysningerBlokk header={'Tiltak registrert på bruker'}>
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <BehandlingOppdaterSaksopplysninger />
                )}
                <BehandlingTiltakOpplysninger tiltaksdeltagelse={tiltaksdeltagelse} />
            </OpplysningerBlokk>

            <Separator />

            <OpplysningerBlokk header={'Alder'}>
                <BodyShort weight={'semibold'}>{`${alderFraDato(fødselsdato)} år`}</BodyShort>
                <BehandlingSaksopplysning navn={'Fødselsdato'} verdi={fødselsdato} />
            </OpplysningerBlokk>

            {behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING && (
                <>
                    <Separator />
                    <OpplysningerBlokk header={'Fra søknad'}>
                        <BehandlingSøknadOpplysninger førstegangsbehandling={behandling} />
                    </OpplysningerBlokk>
                </>
            )}
        </div>
    );
};

const OpplysningerBlokk = ({ header, children }: { header: string; children: ReactNode }) => {
    return (
        <>
            <Heading size={'small'} level={'3'} className={style.header}>
                {header}
            </Heading>
            {children}
        </>
    );
};
