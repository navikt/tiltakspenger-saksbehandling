import { BodyLong } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './BenkSideUtenTilgang.module.css';

export const BenkSideUtenTilgang = () => {
    return (
        <Infokort header={'Ingen tilgang'} className={style.infoboks}>
            <BodyLong>
                {
                    'Brukeren din har ikke en rolle som tillater å vise oversikten over alle behandlinger.'
                }
            </BodyLong>
            <BodyLong>{'Du kan bruke søket for å slå opp en spesifikk bruker.'}</BodyLong>
        </Infokort>
    );
};
