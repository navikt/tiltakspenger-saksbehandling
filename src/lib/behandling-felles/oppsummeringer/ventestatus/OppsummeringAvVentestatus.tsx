import { Box, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterTidspunkt } from '~/utils/date';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { classNames } from '~/utils/classNames';
import { VentestatusHendelse } from '~/types/Ventestatus';
import { OppsummeringAvVentestatuser } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';

import styles from './OppsummeringAvVentestatus.module.css';

type Props = {
    ventestatus: VentestatusHendelse;
    historikk?: VentestatusHendelse[];
    className?: string;
    size?: 'medium' | 'small';
};

export const OppsummeringAvVentestatus = ({ ventestatus, className, size, historikk }: Props) => {
    return (
        <Box className={classNames(styles.box, size === 'small' && styles.boxSmall, className)}>
            <VStack gap="space-24">
                <VStack gap={'space-24'}>
                    <Heading size={size ?? 'medium'} level="3">
                        {ventestatus.erSattPåVent
                            ? 'Behandlingen er satt på vent'
                            : 'Behandlingen er gjenopptatt'}
                    </Heading>
                    <HStack gap={'space-24'}>
                        <OppsummeringsPar
                            label={ventestatus.erSattPåVent ? 'Satt på vent av' : 'Gjenopptatt av'}
                            verdi={ventestatus.sattPåVentAv}
                            retning="vertikal"
                        />
                        <OppsummeringsPar
                            label={'Tidspunkt'}
                            verdi={formaterTidspunkt(ventestatus.tidspunkt)}
                            retning="vertikal"
                        />
                        {ventestatus.frist && (
                            <OppsummeringsPar
                                label={'Frist'}
                                verdi={formaterDatotekst(ventestatus.frist)}
                                retning="vertikal"
                            />
                        )}
                    </HStack>
                    {ventestatus.begrunnelse && (
                        <OppsummeringsPar
                            label={'Begrunnelse'}
                            verdi={ventestatus.begrunnelse}
                            retning="vertikal"
                        />
                    )}
                </VStack>

                {historikk && <OppsummeringAvVentestatuser ventestatuser={historikk} />}
            </VStack>
        </Box>
    );
};

export default OppsummeringAvVentestatus;
