import { useEffect, useState } from 'react';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { isEqualJson } from '~/utils/is-equal-json';
import { ValideringFunc, ValideringResultat, ValideringType } from '~/types/Validering';
import { Nullable } from '~/types/UtilTypes';
import { VedtakContext } from '~/types/Context';

type ValiderOgHentVedtakDTO = (type: ValideringType) => {
    valideringResultat: ValideringResultat;
    vedtakDTO: Nullable<BehandlingVedtakDTO>;
};

export type BehandlingLagringProps = {
    validerOgHentLagringDTO: ValiderOgHentVedtakDTO;
    validerVedtak: (type: ValideringType) => ValideringResultat;
    isDirty: boolean;
};

type Props = {
    vedtak: VedtakContext;
    validerVedtak: ValideringFunc;
    hentDTO: () => Nullable<BehandlingVedtakDTO>;
};

export const useHentBehandlingLagringProps = ({
    vedtak,
    validerVedtak,
    hentDTO,
}: Props): BehandlingLagringProps => {
    const [sisteLagring, setSisteLagring] = useState<BehandlingVedtakDTO | null>(hentDTO());
    const [isDirty, setIsDirty] = useState(false);

    const updateDirtyState = () => {
        setIsDirty(!isEqualJson(hentDTO(), sisteLagring));
    };

    const validerOgHentLagringDTO = (type: ValideringType) => {
        const valideringResultat = validerVedtak(type);
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
        const textAreaElements = Object.values(vedtak.textAreas)
            .map((textArea) => textArea.ref.current)
            .filter((element) => element !== null);

        textAreaElements.forEach((element) => {
            element.addEventListener('input', updateDirtyState);
        });

        return () => {
            textAreaElements.forEach((element) => {
                element.removeEventListener('input', updateDirtyState);
            });
        };
    }, [vedtak.textAreas]);

    useEffect(() => {
        updateDirtyState();
    }, [vedtak]);

    return { validerOgHentLagringDTO, validerVedtak, isDirty };
};
