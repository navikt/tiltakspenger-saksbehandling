import { BodyShort, Button, Dialog, HStack, Select, TextField, VStack } from '@navikt/ds-react';
import dayjs from 'dayjs';
import router from 'next/router';
import { Controller, FieldErrors, useForm, useWatch } from 'react-hook-form';
import styles from '~/dev/DevModal.module.css';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    TiltakDeltakerstatus,
    tiltakDeltakerstatusTekst,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { resolverResultat } from '~/utils/resolverResultat';
import { behandlingUrl } from '~/utils/urls';

enum Endringstype {
    AVSLUTTET_SOM_FORVENTET = 'AVSLUTTET_SOM_FORVENTET',
    AVBRUTT_DELTAKELSE = 'AVBRUTT_DELTAKELSE',
    IKKE_AKTUELL_DELTAKELSE = 'IKKE_AKTUELL_DELTAKELSE',
    FORLENGELSE = 'FORLENGELSE',
    AVKORTET = 'AVKORTET',
    ANDRE_ENDRINGER = 'ANDRE_ENDRINGER',
}

const endringstypeTekst: Record<Endringstype, string> = {
    [Endringstype.AVSLUTTET_SOM_FORVENTET]: 'Avsluttet som forventet',
    [Endringstype.AVBRUTT_DELTAKELSE]: 'Avbrutt deltakelse',
    [Endringstype.IKKE_AKTUELL_DELTAKELSE]: 'Ikke aktuell deltakelse',
    [Endringstype.FORLENGELSE]: 'Forlengelse',
    [Endringstype.AVKORTET]: 'Avkortet',
    [Endringstype.ANDRE_ENDRINGER]: 'Andre endringer',
};

const typerMedSluttdato = [
    Endringstype.FORLENGELSE,
    Endringstype.AVKORTET,
    Endringstype.ANDRE_ENDRINGER,
];
const typerMedDeltakelsesmengde = [Endringstype.FORLENGELSE, Endringstype.ANDRE_ENDRINGER];

type FormData = {
    sakId: string;
    endringstype: Endringstype;
    nySluttdato: Date | undefined;
    nyStartdato: Date | undefined;
    nyDeltakelsesprosent: string;
    nyDagerPerUke: string;
    nyStatus: TiltakDeltakerstatus | '';
};

type Request = {
    sakId: string;
    endringstype: Endringstype;
    nySluttdato: Nullable<string>;
    nyStartdato: Nullable<string>;
    nyDeltakelsesprosent: Nullable<number>;
    nyDagerPerUke: Nullable<number>;
    nyStatus: Nullable<TiltakDeltakerstatus>;
};

type Respons = {
    saksnummer: Saksnummer;
    behandlingId: RammebehandlingId;
};

const tilTall = (verdi: string): Nullable<number> => {
    const trimmet = verdi.trim().replace(',', '.');
    return trimmet ? Number(trimmet) : null;
};

const erUtenforIntervall = (tall: Nullable<number>, min: number, maks: number) =>
    tall !== null && (Number.isNaN(tall) || tall < min || tall > maks);

const senesteVelgbareDato = dayjs().add(2, 'year').endOf('year').toDate();

export const NyUbestemtRevurderingModal = (props: { open: boolean; onClose: () => void }) => {
    const opprett = useFetchJsonFraApi<Respons, Request>('/dev/revurdering/ubestemt', 'POST', {
        onSuccess: (respons) => {
            router.push(
                behandlingUrl({ saksnummer: respons.saksnummer, id: respons.behandlingId }),
            );
        },
    });

    const form = useForm<FormData>({
        defaultValues: {
            sakId: '',
            endringstype: Endringstype.ANDRE_ENDRINGER,
            nySluttdato: undefined,
            nyStartdato: undefined,
            nyDeltakelsesprosent: '',
            nyDagerPerUke: '',
            nyStatus: TiltakDeltakerstatus.DELTAR,
        },
        resolver: async (values) => {
            const errors: FieldErrors<FormData> = {};
            const { endringstype } = values;
            if (!values.sakId.trim()) {
                errors.sakId = { type: 'required', message: 'Sak-ID er påkrevd' };
            }
            if (
                (endringstype === Endringstype.FORLENGELSE ||
                    endringstype === Endringstype.AVKORTET) &&
                !values.nySluttdato
            ) {
                errors.nySluttdato = { type: 'required', message: 'Ny sluttdato er påkrevd' };
            }
            if (typerMedDeltakelsesmengde.includes(endringstype)) {
                if (erUtenforIntervall(tilTall(values.nyDeltakelsesprosent), 0, 100)) {
                    errors.nyDeltakelsesprosent = {
                        type: 'validate',
                        message: 'Må være et tall mellom 0 og 100',
                    };
                }
                if (erUtenforIntervall(tilTall(values.nyDagerPerUke), 0, 7)) {
                    errors.nyDagerPerUke = {
                        type: 'validate',
                        message: 'Må være et tall mellom 0 og 7',
                    };
                }
            }
            if (
                endringstype === Endringstype.ANDRE_ENDRINGER &&
                !values.nySluttdato &&
                !values.nyStartdato &&
                !values.nyDeltakelsesprosent.trim() &&
                !values.nyDagerPerUke.trim() &&
                !values.nyStatus
            ) {
                errors.endringstype = {
                    type: 'validate',
                    message: 'Andre endringer krever minst én endring',
                };
            }
            return resolverResultat(values, errors);
        },
    });

    const endringstype = useWatch({ control: form.control, name: 'endringstype' });
    const medSluttdato = typerMedSluttdato.includes(endringstype);
    const medDeltakelsesmengde = typerMedDeltakelsesmengde.includes(endringstype);
    const medAndreEndringer = endringstype === Endringstype.ANDRE_ENDRINGER;

    const onSubmit = (values: FormData) => {
        opprett.trigger({
            sakId: values.sakId.trim(),
            endringstype: values.endringstype,
            nySluttdato:
                medSluttdato && values.nySluttdato ? dateTilISOTekst(values.nySluttdato) : null,
            nyStartdato:
                medAndreEndringer && values.nyStartdato
                    ? dateTilISOTekst(values.nyStartdato)
                    : null,
            nyDeltakelsesprosent: medDeltakelsesmengde
                ? tilTall(values.nyDeltakelsesprosent)
                : null,
            nyDagerPerUke: medDeltakelsesmengde ? tilTall(values.nyDagerPerUke) : null,
            nyStatus: medAndreEndringer && values.nyStatus ? values.nyStatus : null,
        });
    };

    return (
        <Dialog open={props.open} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup aria-label="Ny ubestemt revurdering">
                <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
                    <Dialog.Header>
                        <Dialog.Title>Ny ubestemt revurdering</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack gap="space-20">
                            <BodyShort>
                                Oppretter en ubestemt revurdering slik systemet gjør det når det
                                ikke kan utlede hvilken type revurdering en endring i
                                tiltaksdeltakelsen krever. Saken må ha et vedtak fra før.
                            </BodyShort>
                            <Controller
                                control={form.control}
                                name={'sakId'}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Sak-ID"
                                        description="F.eks. sak_01..."
                                        size="small"
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name={'endringstype'}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        label="Endring i tiltaksdeltakelsen"
                                        description="Grunnen til at revurderingen ble opprettet"
                                        size="small"
                                        error={fieldState.error?.message}
                                    >
                                        {Object.values(Endringstype).map((type) => (
                                            <option key={type} value={type}>
                                                {endringstypeTekst[type]}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {(medSluttdato || medAndreEndringer) && (
                                <HStack gap="space-16">
                                    {medAndreEndringer && (
                                        <Controller
                                            control={form.control}
                                            name={'nyStartdato'}
                                            render={({ field, fieldState }) => (
                                                <Datovelger
                                                    label="Ny startdato"
                                                    size="small"
                                                    dropdownCaption
                                                    maxDate={senesteVelgbareDato}
                                                    selected={field.value}
                                                    onDateChange={field.onChange}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                    {medSluttdato && (
                                        <Controller
                                            control={form.control}
                                            name={'nySluttdato'}
                                            render={({ field, fieldState }) => (
                                                <Datovelger
                                                    label="Ny sluttdato"
                                                    size="small"
                                                    dropdownCaption
                                                    maxDate={senesteVelgbareDato}
                                                    selected={field.value}
                                                    onDateChange={field.onChange}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    )}
                                </HStack>
                            )}
                            {medDeltakelsesmengde && (
                                <HStack gap="space-16">
                                    <Controller
                                        control={form.control}
                                        name={'nyDeltakelsesprosent'}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Ny deltakelsesprosent"
                                                inputMode="decimal"
                                                size="small"
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={form.control}
                                        name={'nyDagerPerUke'}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Nye dager per uke"
                                                inputMode="decimal"
                                                size="small"
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </HStack>
                            )}
                            {medAndreEndringer && (
                                <Controller
                                    control={form.control}
                                    name={'nyStatus'}
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            label="Ny status"
                                            size="small"
                                            error={fieldState.error?.message}
                                        >
                                            <option value="">Ingen endring</option>
                                            {Object.values(TiltakDeltakerstatus).map((status) => (
                                                <option key={status} value={status}>
                                                    {tiltakDeltakerstatusTekst[status]}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            )}
                            {opprett.error && (
                                <Infokort variant={'feil'}>{opprett.error.message}</Infokort>
                            )}
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <HStack gap="space-16">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={props.onClose}
                                size="small"
                            >
                                Avbryt
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                size="small"
                                loading={opprett.isMutating}
                            >
                                Opprett revurdering
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </form>
            </Dialog.Popup>
        </Dialog>
    );
};
