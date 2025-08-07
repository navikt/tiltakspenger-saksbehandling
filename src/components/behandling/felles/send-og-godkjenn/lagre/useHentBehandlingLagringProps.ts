import { RevurderingInnvilgelseVedtakContext } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { useEffect, useState } from 'react';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { isEqualJson } from '~/utils/is-equal-json';
import { SøknadsbehandlingVedtakContext } from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';
import { RevurderingStansVedtakContext } from '~/components/behandling/revurdering/stans/RevurderingStansVedtakContext';
import { ValideringResultat } from '~/types/Validering';
import { Nullable } from '~/types/UtilTypes';

type ValiderOgHentVedtakDTO = () => {
    valideringResultat: ValideringResultat;
    vedtakDTO: Nullable<BehandlingVedtakDTO>;
};

export type BehandlingLagringProps = {
    validerOgHentVedtakDTO: ValiderOgHentVedtakDTO;
    isDirty: boolean;
};

type VedtakContext =
    | SøknadsbehandlingVedtakContext
    | RevurderingInnvilgelseVedtakContext
    | RevurderingStansVedtakContext;

type Props = {
    vedtak: VedtakContext;
    validerVedtak: () => ValideringResultat;
    hentDTO: () => BehandlingVedtakDTO;
};

export const useHentBehandlingLagringProps = ({
    vedtak,
    validerVedtak,
    hentDTO,
}: Props): BehandlingLagringProps => {
    const [sisteLagring, setSisteLagring] = useState<BehandlingVedtakDTO>(hentDTO());
    const [isDirty, setIsDirty] = useState(false);

    const updateDirtyState = () => {
        setIsDirty(!isEqualJson(hentDTO(), sisteLagring));
    };

    const validerOgHentVedtakDTO = () => {
        const valideringResultat = validerVedtak();
        const harErrors = valideringResultat.errors.length > 0;

        const vedtakDTO = harErrors ? null : hentDTO();
        if (vedtakDTO) {
            setSisteLagring(vedtakDTO);
        }

        return {
            valideringResultat,
            vedtakDTO,
        };
    };

    useEffect(() => {
        Object.values(vedtak.textAreas).forEach((textArea) => {
            textArea.ref.current!.addEventListener('input', updateDirtyState);
        });

        return () => {
            Object.values(vedtak.textAreas).forEach((textArea) => {
                textArea.ref.current!.removeEventListener('input', updateDirtyState);
            });
        };
    }, [vedtak.textAreas]);

    useEffect(() => {
        updateDirtyState();
    }, [vedtak]);

    return { validerOgHentVedtakDTO, isDirty };
};
