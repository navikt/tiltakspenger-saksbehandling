import { Alert, Checkbox, CheckboxGroup, Heading, HStack, VStack } from '@navikt/ds-react';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakId } from '~/types/Sak';
import { Omgjøringsgrad, Rammevedtak, RammevedtakMedBehandling } from '~/types/Rammevedtak';
import { useState } from 'react';
import { classNames } from '~/utils/classNames';

import style from './VedtatteBehandlinger.module.css';

type Props = {
    sakId: SakId;
    behandlinger: Rammebehandling[];
    alleRammevedtak: Rammevedtak[];
    className?: string;
};

export const VedtatteBehandlinger = ({
    sakId,
    behandlinger,
    alleRammevedtak,
    className,
}: Props) => {
    const [visOmgjorte, setVisOmgjorte] = useState<Omgjøringsgrad[]>([
        Omgjøringsgrad.HELT,
        Omgjøringsgrad.DELVIS,
    ]);

    if (alleRammevedtak.length === 0) {
        return null;
    }

    const vedtakMedBehandling = alleRammevedtak
        .map((vedtak) => {
            return {
                ...vedtak,
                behandling: behandlinger.find(
                    (behandling) => behandling.id === vedtak.behandlingId,
                ),
            };
        })
        .filter((vedtak): vedtak is RammevedtakMedBehandling => !!vedtak.behandling)
        .toSorted((a, b) => b.opprettet.localeCompare(a.opprettet));

    const antallVedtakUtenBehandling = alleRammevedtak.length - vedtakMedBehandling.length;

    const vedtakSomSkalVises = vedtakMedBehandling.filter(
        (vedtak) => !vedtak.omgjortGrad || visOmgjorte.includes(vedtak.omgjortGrad),
    );

    return (
        <VStack className={className} gap={'2'}>
            <HStack justify={'space-between'}>
                <Heading level="3" size="small">
                    {'Vedtatte behandlinger'}
                </Heading>
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
                    <Checkbox
                        value={Omgjøringsgrad.HELT}
                        className={classNames(style.omgjortCheckbox, style.heltOmgjortBg)}
                    >
                        {'Helt omgjort'}
                    </Checkbox>
                    <Checkbox
                        value={Omgjøringsgrad.DELVIS}
                        className={classNames(style.omgjortCheckbox, style.delvisOmgjortBg)}
                    >
                        {'Delvis omgjort'}
                    </Checkbox>
                </CheckboxGroup>
            </HStack>
            {antallVedtakUtenBehandling > 0 && (
                <Alert
                    variant={'error'}
                >{`Teknisk feil: ${antallVedtakUtenBehandling} vedtak mangler behandling på denne saken`}</Alert>
            )}
            <VedtatteBehandlingerTabell
                sakId={sakId}
                rammevedtakMedBehandlinger={vedtakSomSkalVises}
            />
        </VStack>
    );
};
