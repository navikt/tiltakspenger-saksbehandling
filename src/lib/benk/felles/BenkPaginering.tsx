import { Pagination } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { BenkOversikt } from '../typer/felles';

/**
 * Paginering skjer server-side: sidetallet (0-basert) ligger i URL-en,
 * og endringer trigger en ny henting mot backend. Første side har ingen
 * side-parameter, slik at URL-en holdes ren.
 *
 * Aktiv side leses fra responsen, ikke URL-en - backend har da allerede
 * korrigert et ugyldig sidetall brukeren kan ha skrevet inn.
 */
export const BenkPaginering = ({ oversikt }: { oversikt: BenkOversikt<unknown> }) => {
    const router = useRouter();
    const { side, sideantall, totalAntall } = oversikt;

    const antallSider = Math.ceil(totalAntall / sideantall);

    if (antallSider <= 1) {
        return null;
    }

    const byttSide = (nySide: number) => {
        const query = { ...router.query };
        const nyttSidetall = nySide - 1;

        if (nyttSidetall > 0) {
            query.side = String(nyttSidetall);
        } else {
            delete query.side;
        }

        return router.push({ query });
    };

    return (
        <Pagination
            page={side + 1}
            onPageChange={byttSide}
            count={antallSider}
            size={'small'}
            prevNextTexts
        />
    );
};
