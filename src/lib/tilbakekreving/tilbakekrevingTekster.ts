import { TilbakekrevingVentegrunn } from '~/lib/tilbakekreving/typer/Tilbakekreving';

export const tilbakekrevingVenterStatusTekst: Record<TilbakekrevingVentegrunn, string> = {
    [TilbakekrevingVentegrunn.AVVENTER_BRUKERUTTALELSE]: 'Avventer brukeruttalelse',
} as const;
