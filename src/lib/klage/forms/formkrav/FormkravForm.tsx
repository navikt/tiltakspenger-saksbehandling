import { Control, Controller, useWatch } from 'react-hook-form';
import {
    FormkravFormData,
    KlagefristUnntakSvarordFormData,
    KlagefristUnntakSvarordFormDataTekstMapper,
    INGEN_VEDTAK,
    KlageInnsendingskildeFormData,
    KlageInnsendingskildeFormDataTekstMapper,
    VedtakstypeFormkravFormData,
} from './FormkravFormUtils';
import { HStack, LocalAlert, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react';
import { RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import JournalpostId from '~/lib/_felles/journalpostId/JournalpostId';
import { Nullable } from '~/types/UtilTypes';
import styles from './FormkravForm.module.css';
import { formaterTidspunktKort, startOfDay, ukenummerFraDatotekst } from '~/utils/date';
import { benkBehandlingstypeTekst } from '~/lib/benk/benkSideUtils';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import dayjs from 'dayjs';
import { MeldekortvedtakMedBehandling } from '~/lib/meldekort/typer/Meldekortvedtak';

const FormkravForm = (props: {
    control: Control<FormkravFormData>;
    rammevedtakOgBehandlinger: RammevedtakMedBehandling[];
    meldekortvedtakOgBehandlinger: MeldekortvedtakMedBehandling[];
    fnrFraPersonopplysninger: Nullable<string>;
    readonly?: boolean;
}) => {
    const vedtakSomKanKlagesPå = [
        ...props.rammevedtakOgBehandlinger,
        ...props.meldekortvedtakOgBehandlinger,
    ].toSorted((a, b) => dayjs(a.opprettet).diff(dayjs(b.opprettet)));

    const erKlagefristOverholdt = useWatch({
        control: props.control,
        name: 'erKlagefristOverholdt',
    });

    const valgtVedtakId = useWatch({
        control: props.control,
        name: 'vedtakDetPåklages',
    });

    const valgtVedtak = vedtakSomKanKlagesPå.find(({ id }) => id === valgtVedtakId);

    const valgtInnsendingsdato = useWatch({
        control: props.control,
        name: 'innsendingsdato',
    });

    const vedtakstype = useWatch({
        control: props.control,
        name: 'vedtakstype',
    });

    const overstigerKlagedato6UkersFristForVedtak =
        valgtVedtak &&
        valgtInnsendingsdato &&
        dayjs(valgtVedtak.opprettet).add(6, 'week').isBefore(dayjs(valgtInnsendingsdato));

    return (
        <VStack gap="space-32" align="start">
            <JournalpostId
                fnrFraPersonopplysninger={props.fnrFraPersonopplysninger}
                readonly={props.readonly}
                className={styles.journalpostIdInputContainer}
            />

            <Controller
                control={props.control}
                name="vedtakstype"
                render={({ field, fieldState }) => (
                    <Select
                        label="Vedtakstype"
                        {...field}
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <option value="">Ikke valgt</option>
                        <option value={INGEN_VEDTAK}>Har ikke klaget på et vedtak</option>
                        <option value={VedtakstypeFormkravFormData.RAMMEVEDTAK}>Rammevedtak</option>
                        <option value={VedtakstypeFormkravFormData.MELDEKORTVEDTAK}>
                            Meldekortvedtak
                        </option>
                    </Select>
                )}
            />
            {(vedtakstype === VedtakstypeFormkravFormData.RAMMEVEDTAK ||
                vedtakstype === VedtakstypeFormkravFormData.MELDEKORTVEDTAK) && (
                <Controller
                    control={props.control}
                    name="vedtakDetPåklages"
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            label="Vedtaket som er påklaget"
                            error={fieldState.error?.message}
                            readOnly={props.readonly}
                        >
                            <option value="">Ikke valgt</option>
                            {vedtakstype === VedtakstypeFormkravFormData.RAMMEVEDTAK &&
                                props.rammevedtakOgBehandlinger.map(({ behandling, ...vedtak }) => {
                                    return (
                                        <option
                                            key={`${vedtak.id}-${behandling.id}`}
                                            value={vedtak.id}
                                        >
                                            {benkBehandlingstypeTekst[behandling.type]} -{' '}
                                            {behandlingResultatTilText[vedtak.resultat]} -{' '}
                                            {formaterTidspunktKort(vedtak.opprettet)}
                                        </option>
                                    );
                                })}
                            {vedtakstype === VedtakstypeFormkravFormData.MELDEKORTVEDTAK &&
                                props.meldekortvedtakOgBehandlinger.map(
                                    ({ behandling, ...vedtak }) => {
                                        const ukerString = `${ukenummerFraDatotekst(behandling.periode.fraOgMed)} og ${ukenummerFraDatotekst(behandling.periode.tilOgMed)}`;

                                        return (
                                            <option
                                                key={`${vedtak.id}-${behandling.id}`}
                                                value={vedtak.id}
                                            >
                                                Uke {ukerString} -{' '}
                                                {formaterTidspunktKort(vedtak.opprettet)}
                                            </option>
                                        );
                                    },
                                )}
                        </Select>
                    )}
                />
            )}

            <Controller
                control={props.control}
                name={'innsendingsdato'}
                render={({ field, fieldState }) => (
                    <Datovelger
                        onDateChange={(date) => {
                            field.onChange(date);
                        }}
                        maxDate={new Date()}
                        selected={field.value ?? undefined}
                        error={fieldState.error?.message}
                        label="Innsendingsdato for klagen"
                        readOnly={props.readonly}
                    />
                )}
            />

            {overstigerKlagedato6UkersFristForVedtak && (
                <LocalAlert status="warning" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Valgt dato overstiger 6 ukers frist</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        Innsendingsdato for klagen overstiger 6 ukers frist for det valgte vedtaket.
                        Vennligst sjekk at du har valgt riktig vedtak og dato.
                    </LocalAlert.Content>
                </LocalAlert>
            )}

            {valgtVedtak &&
                valgtInnsendingsdato &&
                valgtInnsendingsdato < startOfDay(valgtVedtak.opprettet) && (
                    <LocalAlert status="warning" size="small">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Verifiser innsendingsdato for klage</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            Innsendingsdato for klagen er før vedtaket som er påklaget. Vennligst
                            sjekk at du har valgt riktig vedtak og dato.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}

            <Controller
                control={props.control}
                name={'innsendingskilde'}
                render={({ field, fieldState }) => (
                    <Select
                        {...field}
                        label="Innsendingskilde for klagen"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <option value="">Ikke valgt</option>
                        {Object.values(KlageInnsendingskildeFormData).map((kilde) => (
                            <option key={kilde} value={kilde}>
                                {KlageInnsendingskildeFormDataTekstMapper[kilde]}
                            </option>
                        ))}
                    </Select>
                )}
            />

            <Controller
                control={props.control}
                name="erKlagerPartISaken"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klager part i saken?"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="klagesDetPåKonkreteElementer"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Klages det på konkrete elementer i vedtaket?"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="erKlagefristOverholdt"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagefristen overholdt?"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            {erKlagefristOverholdt === false && (
                <Controller
                    control={props.control}
                    name="erUnntakForKlagefrist"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            className={styles.erUnntakForKlagefristRadioGroup}
                            {...field}
                            legend="Er unntak for klagefristen oppfylt?"
                            error={fieldState.error?.message}
                            readOnly={props.readonly}
                        >
                            {Object.values(KlagefristUnntakSvarordFormData).map((svarord) => (
                                <Radio key={svarord} value={svarord}>
                                    {KlagefristUnntakSvarordFormDataTekstMapper[svarord]}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            )}
            <Controller
                control={props.control}
                name="erKlagenSignert"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagen signert?"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
        </VStack>
    );
};

export default FormkravForm;
