import { useEffect, useState } from 'react';

import { isEqualJson } from '~/utils/is-equal-json';
import { ValideringFunc, ValideringResultat, ValideringType } from '~/types/Validering';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';
import { RammebehandlingVedtakRequest } from '~/types/Rammebehandling';

type ValiderOgHentVedtakDTO = (type: ValideringType) => {
    valideringResultat: ValideringResultat;
    vedtakDTO: Nullable<RammebehandlingVedtakRequest>;
};

export type BehandlingLagringProps = {
    validerOgHentLagringDTO: ValiderOgHentVedtakDTO;
    validerVedtak: (type: ValideringType) => ValideringResultat;
    isDirty: boolean;
};

type Props = {
    skjema: BehandlingSkjemaContext;
    validerSkjema: ValideringFunc;
    hentDTO: () => Nullable<RammebehandlingVedtakRequest>;
};

export const useHentBehandlingLagringProps = ({
    skjema,
    validerSkjema,
    hentDTO,
}: Props): BehandlingLagringProps => {
    const [sisteLagring, setSisteLagring] = useState<RammebehandlingVedtakRequest | null>(
        hentDTO(),
    );
    const [isDirty, setIsDirty] = useState(false);

    const updateDirtyState = () => {
        setIsDirty(!isEqualJson(hentDTO(), sisteLagring));
    };

    const validerOgHentLagringDTO = (type: ValideringType) => {
        const valideringResultat = validerSkjema(type);
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
        const textAreaElements = Object.values(skjema.textAreas)
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
    }, [skjema.textAreas]);

    useEffect(() => {
        updateDirtyState();
    }, [skjema]);

    return { validerOgHentLagringDTO, validerVedtak: validerSkjema, isDirty };
};
