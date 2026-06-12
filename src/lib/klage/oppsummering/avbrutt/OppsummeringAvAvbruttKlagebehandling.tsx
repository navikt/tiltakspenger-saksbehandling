import { Box, VStack, Heading, HStack } from '@navikt/ds-react';
import { OppsummeringsPar } from '~/lib/behandling-felles/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { classNames } from '~/utils/classNames';
import { formaterTidspunkt } from '~/utils/date';
import { KlagebehandlingAvbrutt } from '../../typer/Klage';
import styles from './OppsummeringAvAvbruttKlagebehandling.module.css';
import { avbrytKlagebehandlingStatusLabels } from '../../utils/klageUtils';

const OppsummeringAvAvbruttKlagebehandling = (props: {
    avbrutt: KlagebehandlingAvbrutt;
    withPanel?: boolean;
    wrapperClassName?: string;
}) => {
    return (
        <Box
            background={props.withPanel ? 'default' : undefined}
            className={classNames(styles.box, props.wrapperClassName)}
        >
            <VStack gap="space-24">
                <Heading size="medium" level="3">
                    Behandling er avsluttet
                </Heading>
                <HStack gap="space-24">
                    <OppsummeringsPar
                        label={'Avsluttet av'}
                        verdi={props.avbrutt.avbruttAv}
                        retning="vertikal"
                    />
                    <OppsummeringsPar
                        label={'Tidspunkt avsluttet'}
                        verdi={formaterTidspunkt(props.avbrutt.avbruttTidspunkt)}
                        retning="vertikal"
                    />
                </HStack>
                <OppsummeringsPar
                    label={'Status'}
                    verdi={avbrytKlagebehandlingStatusLabels[props.avbrutt.status]}
                    retning="vertikal"
                />
                {props.avbrutt.begrunnelse && (
                    <OppsummeringsPar
                        label={'Begrunnelse'}
                        verdi={props.avbrutt.begrunnelse}
                        retning="vertikal"
                    />
                )}
            </VStack>
        </Box>
    );
};

export default OppsummeringAvAvbruttKlagebehandling;
