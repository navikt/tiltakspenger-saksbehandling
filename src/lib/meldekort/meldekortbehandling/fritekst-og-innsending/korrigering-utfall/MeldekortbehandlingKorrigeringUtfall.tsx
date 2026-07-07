import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

type Props = {
    simulertBeregning: SimulertBeregning;
};

export const MeldekortbehandlingKorrigeringUtfall = ({ simulertBeregning }: Props) => {
    const { beregning } = simulertBeregning;

    const beløpDiff = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    return (
        <Infokort variant={'advarsel'} header={'Korrigert utbetaling'}>
            {utfallTekst(beløpDiff)}
        </Infokort>
    );
};

const utfallTekst = (beløpDiff: number) => {
    if (beløpDiff < 0) {
        return 'Vurder å sende forhåndsvarsling til bruker om mulig tilbakebetaling i tilbakekrevingsløsningen eller via brevløsningen i Gosys.';
    }

    if (beløpDiff > 0) {
        return 'Husk å informere bruker om etterbetalingen og konsekvensene av det i Modia.';
    }

    return 'Husk å informere bruker om utfallet av korrigeringen i Modia selv om det ikke vil ha en praktisk betydning for utbetalingen.';
};
