import { Alert, Checkbox, CheckboxGroup, HStack, VStack } from '@navikt/ds-react';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakId } from '~/types/Sak';
import { Omgjøringsgrad, Rammevedtak } from '~/types/Rammevedtak';
import { useState } from 'react';
import { classNames } from '~/utils/classNames';

import style from './VedtatteBehandlinger.module.css';
import { Klagevedtak } from '~/types/Klagevedtak';
import { Klagebehandling } from '~/types/Klage';

type Props = {
    sakId: SakId;
    rammebehandlinger: Rammebehandling[];
    alleRammevedtak: Rammevedtak[];
    klagebehandlinger: Klagebehandling[];
    alleKlagevedtak: Klagevedtak[];
    className?: string;
};

export const VedtatteBehandlinger = ({
    sakId,
    rammebehandlinger,
    alleRammevedtak,
    klagebehandlinger,
    alleKlagevedtak,
    className,
}: Props) => {
    const [visOmgjorte, setVisOmgjorte] = useState<Omgjøringsgrad[]>([
        Omgjøringsgrad.HELT,
        Omgjøringsgrad.DELVIS,
    ]);

    if (alleRammevedtak.length === 0 && alleKlagevedtak.length === 0) {
        return null;
    }

    const rammevedtakMedBehandling = alleRammevedtak.map((vedtak) => {
        return {
            type: 'rammevedtak',
            ...vedtak,
            behandling: rammebehandlinger.find(
                (behandling) => behandling.id === vedtak.behandlingId,
            ),
        };
    }) as Array<{ type: 'rammevedtak' } & Rammevedtak & { behandling: Rammebehandling }>;

    const klagevedtakMedBehandling = alleKlagevedtak.map((vedtak) => {
        return {
            type: 'klagevedtak',
            ...vedtak,
            behandling: klagebehandlinger.find((klage) => klage.id === vedtak.klagebehandlingId),
        };
    }) as Array<{ type: 'klagevedtak' } & Klagevedtak & { behandling: Klagebehandling }>;

    const vedtakMedBehandling = [...rammevedtakMedBehandling, ...klagevedtakMedBehandling].toSorted(
        (a, b) => b.opprettet.localeCompare(a.opprettet),
    );

    const antallVedtakUtenBehandling =
        alleRammevedtak.length + alleKlagevedtak.length - vedtakMedBehandling.length;

    const antallHeltOmgjort = alleRammevedtak.reduce(
        (acc, vedtak) => (vedtak.omgjortGrad === Omgjøringsgrad.HELT ? acc + 1 : acc),
        0,
    );
    const antallDelvisOmgjort = alleRammevedtak.reduce(
        (acc, vedtak) => (vedtak.omgjortGrad === Omgjøringsgrad.DELVIS ? acc + 1 : acc),
        0,
    );

    const vedtakSomSkalVises = vedtakMedBehandling.filter(
        (vedtak) =>
            !(
                vedtak.type === 'rammevedtak' &&
                vedtak.omgjortGrad &&
                !visOmgjorte.includes(vedtak.omgjortGrad)
            ),
    );

    return (
        <VStack className={className}>
            <HStack justify={'space-between'}>
                <CheckboxGroup
                    legend={'Vis omgjorte vedtak'}
                    hideLegend={true}
                    size={'small'}
                    value={visOmgjorte}
                    onChange={(values: Omgjøringsgrad[]) => {
                        setVisOmgjorte(values);
                    }}
                    className={style.omgjortGroup}
                >
                    {antallHeltOmgjort > 0 && (
                        <Checkbox
                            value={Omgjøringsgrad.HELT}
                            className={classNames(style.omgjortCheckbox, style.heltOmgjortBg)}
                        >
                            {`Helt omgjort (${antallHeltOmgjort})`}
                        </Checkbox>
                    )}
                    {antallDelvisOmgjort > 0 && (
                        <Checkbox
                            value={Omgjøringsgrad.DELVIS}
                            className={classNames(style.omgjortCheckbox, style.delvisOmgjortBg)}
                        >
                            {`Delvis omgjort (${antallDelvisOmgjort})`}
                        </Checkbox>
                    )}
                </CheckboxGroup>
            </HStack>
            {antallVedtakUtenBehandling > 0 && (
                <Alert
                    variant={'error'}
                >{`Teknisk feil: ${antallVedtakUtenBehandling} vedtak mangler behandling på denne saken`}</Alert>
            )}
            <VedtatteBehandlingerTabell sakId={sakId} vedtakMedBehandling={vedtakSomSkalVises} />
        </VStack>
    );
};
