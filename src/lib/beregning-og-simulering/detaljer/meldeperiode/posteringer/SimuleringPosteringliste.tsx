import { BodyShort, Heading, Tag, VStack } from '@navikt/ds-react';
import { Simuleringspostering } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { tilVisbarePosteringer } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/dag/simuleringsmerker';

import style from './SimuleringPosteringliste.module.css';

type Props = {
    posteringer: Simuleringspostering[];
};

/**
 * Posteringene fra oppdragssystemet som treffer meldeperioden, én rad per postering.
 * Dette er stedet beløp og perioder vises — dagene i tabellen bærer bare kompakte merker.
 */
export const SimuleringPosteringliste = ({ posteringer }: Props) => {
    const visbarePosteringer = tilVisbarePosteringer(posteringer);

    if (visbarePosteringer.length === 0) {
        return null;
    }

    return (
        <VStack gap={'space-8'}>
            <Heading size={'xsmall'} level={'4'}>
                {'Posteringer fra oppdrag i meldeperioden'}
            </Heading>
            <div className={style.rader}>
                {visbarePosteringer.flatMap(({ etikett, variant, beløp, periode }, index) => [
                    <Tag size={'xsmall'} variant={variant} key={`${index}-tag`}>
                        {etikett}
                    </Tag>,
                    <BodyShort size={'small'} className={style.beløp} key={`${index}-beløp`}>
                        {beløp}
                    </BodyShort>,
                    <BodyShort size={'small'} textColor={'subtle'} key={`${index}-periode`}>
                        {periode}
                    </BodyShort>,
                ])}
            </div>
        </VStack>
    );
};
