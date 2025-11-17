import { Periode } from '~/types/Periode';
import { useSak } from '~/context/sak/SakContext';
import { perioderOverlapper } from '~/utils/periode';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { OppsummeringAvSøknad } from '~/components/oppsummeringer/oppsummeringAvSøknad/OppsummeringAvSøknad';
import { Alert, BodyShort, Link, Select, VStack } from '@navikt/ds-react';
import NextLink from 'next/link';
import { behandlingUrl } from '~/utils/urls';
import { useState } from 'react';
import { formaterTidspunkt } from '~/utils/date';

type Props = {
    periode: Periode;
};

export const SøknadOpplysningerVelger = ({ periode }: Props) => {
    const { sak } = useSak();
    const { alleRammevedtak, behandlinger } = sak;

    const vedtatteSøknadsbehandlinger = alleRammevedtak
        .filter((vedtak) => perioderOverlapper(vedtak.periode, periode))
        .map((vedtak) => behandlinger.find((beh) => beh.id === vedtak.behandlingId)!)
        .filter((behandling) => behandling.resultat === SøknadsbehandlingResultat.INNVILGELSE)
        .toSorted((a, b) => (a.iverksattTidspunkt! > b.iverksattTidspunkt! ? -1 : 1));

    const [valgtBehandling, setValgtBehandling] = useState(vedtatteSøknadsbehandlinger.at(0));

    if (vedtatteSøknadsbehandlinger.length === 0) {
        return (
            <Alert variant={'info'} inline={true} size={'small'}>
                {'Fant ingen tidligere innvilgede søknader'}
            </Alert>
        );
    }

    return (
        <VStack gap={'4'}>
            <Select
                label={'Velg søknad'}
                size={'small'}
                onChange={(e) =>
                    setValgtBehandling(vedtatteSøknadsbehandlinger.at(Number(e.target.value)))
                }
            >
                {vedtatteSøknadsbehandlinger.map((behandling, index) => (
                    <option
                        value={index}
                        key={index}
                    >{`Innvilget tidspunkt: ${formaterTidspunkt(behandling.iverksattTidspunkt!)}`}</option>
                ))}
            </Select>

            {valgtBehandling && (
                <VStack gap={'2'}>
                    <Link as={NextLink} href={behandlingUrl(valgtBehandling)}>
                        <BodyShort size={'small'}>{'Til behandlingen'}</BodyShort>
                    </Link>
                    <OppsummeringAvSøknad
                        tiltaksperiode={periode}
                        søknad={valgtBehandling.søknad}
                    />
                </VStack>
            )}
        </VStack>
    );
};
