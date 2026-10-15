import { useCallback, useEffect, useState } from 'react';

import { isEqualJson } from '~/utils/is-equal-json';
import {
    ValideringFunc,
    ValideringResultat,
    ValideringType,
} from '~/lib/rammebehandling/typer/Validering';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { OppdaterBehandlingDTO } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    PRIORITERING_MANGLER_BEGRUNNELSE,
    prioriteringManglerBegrunnelse,
} from '~/lib/_felles/prioritering/prioriteringUtils';
import { skalJournalføreBarnetilleggNotat } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';

type ValiderOgHentVedtakDTO = (type: ValideringType) => {
    valideringResultat: ValideringResultat;
    vedtakDTO: Nullable<OppdaterBehandlingDTO>;
};

export type BehandlingLagringProps = {
    validerOgHentLagringDTO: ValiderOgHentVedtakDTO;
    validerVedtak: (type: ValideringType) => ValideringResultat;
    isDirty: boolean;
};

type Props = {
    skjema: BehandlingSkjemaContext;
    validerSkjema: ValideringFunc;
    hentDTO: () => Nullable<OppdaterBehandlingDTO>;
};

export const useHentBehandlingLagringProps = ({
    skjema,
    validerSkjema,
    hentDTO,
}: Props): BehandlingLagringProps => {
    const [sisteLagring, setSisteLagring] = useState<OppdaterBehandlingDTO | null>(hentDTO());
    const [isDirty, setIsDirty] = useState(false);

    const updateDirtyState = useCallback(() => {
        setIsDirty(!isEqualJson(hentDTO(), sisteLagring));
    }, [hentDTO, sisteLagring]);

    const validerVedtak: ValideringFunc = (type) => {
        const valideringResultat = validerPrioritering(skjema, validerSkjema(type));

        if (type !== 'tilBeslutning') {
            return valideringResultat;
        }

        const journalføringErrors: string[] = [];

        if (
            skjema.skalJournalføreNotat.vilkårsvurdering &&
            skjema.textAreas.begrunnelse.getValue() === null
        ) {
            journalføringErrors.push('Begrunnelsen må være utfylt når notatet skal journalføres');
        }

        if (
            skalJournalføreBarnetilleggNotat(skjema) &&
            skjema.textAreas.barnetilleggBegrunnelse.getValue() === null
        ) {
            journalføringErrors.push(
                'Begrunnelsen for barnetillegg må være utfylt når den skal journalføres som notat',
            );
        }

        if (journalføringErrors.length === 0) {
            return valideringResultat;
        }

        return {
            ...valideringResultat,
            errors: [...valideringResultat.errors, ...journalføringErrors],
        };
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
    }, [skjema.textAreas, updateDirtyState]);

    useEffect(() => {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        updateDirtyState();
    }, [skjema, updateDirtyState]);

    return { validerOgHentLagringDTO, validerVedtak, isDirty };
};

const validerPrioritering = (
    skjema: BehandlingSkjemaContext,
    valideringResultat: ValideringResultat,
): ValideringResultat => {
    if (
        prioriteringManglerBegrunnelse(
            skjema.erPrioritert,
            skjema.textAreas.prioriteringBegrunnelse.getValue(),
        )
    ) {
        return {
            ...valideringResultat,
            errors: [...valideringResultat.errors, PRIORITERING_MANGLER_BEGRUNNELSE],
        };
    }

    return valideringResultat;
};
