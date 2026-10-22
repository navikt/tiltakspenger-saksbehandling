import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/lib/sak/SakTyper';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';

/** Tildeler den innloggede saksbehandleren alle tilbakekrevingene, eller ingen av dem */
export const useTildelTilbakekrevinger = () => {
    return useFetchJsonFraApi<ResponseBody, RequestBody>('/tilbakekreving/tildel', 'POST');
};

type RequestBody = {
    tilbakekrevinger: Array<{
        tilbakekrevingId: TilbakekrevingId;
        sakId: SakId;
    }>;
};

type ResponseBody = {
    tilbakekrevinger: Array<{
        tilbakekrevingId: TilbakekrevingId;
        saksnummer: Saksnummer;
    }>;
};
