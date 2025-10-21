import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import styles from './OppsummeringAvAttestering.module.css';
import { formaterTidspunkt } from '../../utils/date';
import { Attestering, Attesteringsstatus } from '~/types/Attestering';

const OppsummeringAvAttesteringer = (props: { attesteringer: Attestering[] }) => {
    if (props.attesteringer.length === 0) {
        return null;
    }

    return (
        <div>
            <Heading size="small">Attesteringer</Heading>
            <ul className={styles.attesteringerContainer}>
                {props.attesteringer.map((attestering) => (
                    <li
                        key={`attestering-${attestering.endretTidspunkt}`}
                        className={styles.attesteringContainer}
                    >
                        <VStack gap="2">
                            <HStack gap="1" align={'center'}>
                                {attestering.status === Attesteringsstatus.SENDT_TILBAKE && (
                                    <ExclamationmarkTriangleFillIcon
                                        title="Advarsel-trekant"
                                        fontSize="1.5rem"
                                        color="var(--a-orange-500)"
                                    />
                                )}
                                {attestering.status === Attesteringsstatus.GODKJENT && (
                                    <CheckmarkCircleFillIcon
                                        title="sjekk-merke-ikon"
                                        fontSize="1.5rem"
                                        color="var(--a-green-500)"
                                    />
                                )}
                                <BodyShort size={'small'}>
                                    {`${formaterTidspunkt(attestering.endretTidspunkt)} - ${attestering.endretAv}`}
                                </BodyShort>
                            </HStack>
                            <BodyShort spacing>{attestering.begrunnelse}</BodyShort>
                        </VStack>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OppsummeringAvAttesteringer;
