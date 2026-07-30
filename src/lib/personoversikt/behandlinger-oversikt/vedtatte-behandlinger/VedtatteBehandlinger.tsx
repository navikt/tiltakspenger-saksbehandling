import { VStack } from '@navikt/ds-react';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
import { Omgjøringsgrad } from '~/lib/rammebehandling/typer/Rammevedtak';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { hentKlagevedtakMedBehandlinger, hentRammevedtakMedBehandlinger } from '~/lib/sak/sakUtils';
import {
    RammevedtakEllerKlageMedBehandling,
    VedtakType,
} from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { OmgjortGradVisningVelger } from '~/lib/personoversikt/behandlinger-oversikt/vedtatte-behandlinger/omgjort-grad-velger/OmgjortGradVisningVelger';

export const VedtatteBehandlinger = () => {
    const { sak } = useSak();
    const { sakId } = sak;

    const [visOmgjorte, setVisOmgjorte] = useState<Omgjøringsgrad[]>([
        Omgjøringsgrad.HELT,
        Omgjøringsgrad.DELVIS,
    ]);

    const vedtakMedBehandling: RammevedtakEllerKlageMedBehandling[] = [
        ...hentRammevedtakMedBehandlinger(sak),
        ...hentKlagevedtakMedBehandlinger(sak),
    ].toSorted((a, b) => b.opprettet.localeCompare(a.opprettet));

    if (vedtakMedBehandling.length === 0) {
        return <Infokort variant={'info'}>{'Ingen vedtatte behandlinger på denne saken'}</Infokort>;
    }

    const vedtakSomSkalVises = vedtakMedBehandling.filter(
        (vedtak) =>
            !(
                vedtak.vedtakType === VedtakType.Rammebehandling &&
                vedtak.omgjortGrad &&
                !visOmgjorte.includes(vedtak.omgjortGrad)
            ),
    );

    return (
        <VStack>
            <OmgjortGradVisningVelger
                vedtakMedBehandling={vedtakMedBehandling}
                visOmgjorte={visOmgjorte}
                setVisOmgjorte={setVisOmgjorte}
            />

            <VedtatteBehandlingerTabell sakId={sakId} vedtakMedBehandling={vedtakSomSkalVises} />
        </VStack>
    );
};
