import { FieldErrors } from 'react-hook-form';
import { BrevFormData, brevFormValidation } from '~/lib/klage/forms/brev/BrevFormUtils';
import { resolverResultat } from '~/utils/resolverResultat';
import { ForvaltningsmeldingRequest } from '~/lib/klage/typer/Klage';

export const standardtekstForvaltningsmelding = (): BrevFormData => ({
    tekstfelter: [
        {
            tittel: 'Svartid',
            tekst: [
                'Saken vil bli behandlet innen ca. X måneder.',
                'Hvis saken ikke blir avgjort i løpet av denne tiden, vil du høre nærmere fra oss.',
            ].join('\n'),
        },
        {
            tittel: 'Begrunnelse for saksbehandlingstiden vår',
            tekst: [
                'Vi har mange saker til behandling og det vil derfor ta noe tid før vi får behandlet saken din.',
                '',
                'På grunn av stor arbeidsmengde er saksbehandlingstiden ca. X måneder. Saksbehandlingstiden er beregnet fra vi mottok din klage.',
            ].join('\n'),
        },
    ],
});

export const forvaltningsmeldingFormDataTilForhåndsvisRequest = (
    data: BrevFormData,
): ForvaltningsmeldingRequest => ({
    tekster: data.tekstfelter.filter(
        (avsnitt) => avsnitt.tittel.trim().length > 0 && avsnitt.tekst.trim().length > 0,
    ),
});

export const forvaltningsmeldingFormDataTilSendRequest = (
    data: BrevFormData,
): ForvaltningsmeldingRequest => ({
    tekster: data.tekstfelter.map((avsnitt) => ({ tittel: avsnitt.tittel, tekst: avsnitt.tekst })),
});

const plassholder = /(?<![\p{L}\p{N}])X(?![\p{L}\p{N}])/u;

export const inneholderPlassholder = (tekst: string): boolean => plassholder.test(tekst);

export const forvaltningsmeldingFormValidation = (data: BrevFormData) => {
    const errors: FieldErrors<BrevFormData> = { ...brevFormValidation(data).errors };

    data.tekstfelter.forEach((avsnitt, index) => {
        (['tittel', 'tekst'] as const).forEach((felt) => {
            if (!inneholderPlassholder(avsnitt[felt]) || errors.tekstfelter?.[index]?.[felt]) {
                return;
            }
            errors.tekstfelter = errors.tekstfelter ?? [];
            errors.tekstfelter[index] = errors.tekstfelter[index] ?? {};
            errors.tekstfelter[index][felt] = {
                type: `tekstfelter.${index}.${felt}`,
                message: 'Bytt ut X med antall måneder eller uker',
            };
        });
    });

    return resolverResultat(data, errors);
};
