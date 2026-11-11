import { useState } from 'react';
import { Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { v4 as uuidv4 } from 'uuid';
import { useBehandlingInnvilgelseSkjemaDispatch } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    BarnetilleggBarnSkjema,
    erSammeBarn,
    tilBarnetilleggBarnSkjema,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { hentVerdi } from '~/utils/sladdetVerdi';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { IkkeSladdetVerdi } from '~/types/SladdetVerdi';

import style from './BarnetilleggBarn.module.css';

type Felter = {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    fødselsdato: Nullable<Dato>;
    fnr: string;
};

type Feil = Partial<Record<keyof Felter, string>>;

const TOMT_SKJEMA: Felter = {
    fornavn: '',
    mellomnavn: '',
    etternavn: '',
    fødselsdato: null,
    fnr: '',
};

type Props = {
    // Barn som allerede finnes i listen, og ikke kan legges til på nytt
    eksisterendeBarn: BarnetilleggBarnSkjema[];
};

export const LeggTilBarnetilleggBarn = ({ eksisterendeBarn }: Props) => {
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const [visSkjema, setVisSkjema] = useState(false);
    const [felter, setFelter] = useState<Felter>(TOMT_SKJEMA);
    const [feil, setFeil] = useState<Feil>({});

    const oppdater = (oppdatering: Partial<Felter>) => {
        setFelter((forrige) => ({ ...forrige, ...oppdatering }));
        setFeil((forrige) => {
            const nye = { ...forrige };
            Object.keys(oppdatering).forEach((felt) => delete nye[felt as keyof Felter]);
            return nye;
        });
    };

    const lukk = () => {
        setVisSkjema(false);
        setFelter(TOMT_SKJEMA);
        setFeil({});
    };

    if (!visSkjema) {
        return (
            <Button
                type={'button'}
                variant={'secondary'}
                size={'small'}
                icon={<PlusIcon aria-hidden />}
                className={style.leggTilKnapp}
                onClick={() => setVisSkjema(true)}
            >
                {'Legg til barn'}
            </Button>
        );
    }

    const leggTil = () => {
        const valideringsfeil = validerFelter(felter);

        if (Object.keys(valideringsfeil).length > 0 || !felter.fødselsdato) {
            setFeil(valideringsfeil);
            return;
        }

        const tekst = (verdi: string): IkkeSladdetVerdi<Nullable<string>> => ({
            erSladdet: false,
            verdi: verdi.trim() || null,
        });

        const barn = tilBarnetilleggBarnSkjema(
            {
                fnr: tekst(felter.fnr),
                fornavn: tekst(felter.fornavn),
                mellomnavn: tekst(felter.mellomnavn),
                etternavn: tekst(felter.etternavn),
                fødselsdato: { erSladdet: false, verdi: felter.fødselsdato },
                kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
                søknadId: null,
                periode: null,
            },
            uuidv4(),
        );

        const eksisterende = eksisterendeBarn.find((it) => erSammeBarn(it, barn));

        if (eksisterende) {
            const erLiktFnr = !!hentVerdi(barn.fnr) && !!hentVerdi(eksisterende.fnr);

            setFeil({ [erLiktFnr ? 'fnr' : 'fornavn']: 'Barnet finnes allerede i listen' });
            return;
        }

        dispatch({ type: 'leggTilManueltBarnetilleggBarn', payload: { barn } });
        lukk();
    };

    return (
        <VStack gap={'space-16'} className={style.leggTilSkjema}>
            <Heading level={'4'} size={'xsmall'}>
                {'Legg til barn'}
            </Heading>
            <HStack gap={'space-16'} align={'start'}>
                <TextField
                    label={'Fornavn'}
                    size={'small'}
                    value={felter.fornavn}
                    error={feil.fornavn}
                    onChange={(event) => oppdater({ fornavn: event.target.value })}
                />
                <TextField
                    label={'Mellomnavn (valgfritt)'}
                    size={'small'}
                    value={felter.mellomnavn}
                    onChange={(event) => oppdater({ mellomnavn: event.target.value })}
                />
                <TextField
                    label={'Etternavn'}
                    size={'small'}
                    value={felter.etternavn}
                    error={feil.etternavn}
                    onChange={(event) => oppdater({ etternavn: event.target.value })}
                />
            </HStack>
            <HStack gap={'space-16'} align={'start'}>
                <Datovelger
                    label={'Fødselsdato'}
                    size={'small'}
                    dropdownCaption={true}
                    maxDate={new Date()}
                    selected={felter.fødselsdato ?? undefined}
                    error={feil.fødselsdato}
                    onDateChange={(dato) =>
                        oppdater({ fødselsdato: dato ? dateTilISOTekst(dato) : null })
                    }
                />
                <TextField
                    label={'Fødselsnummer (valgfritt)'}
                    size={'small'}
                    inputMode={'numeric'}
                    autoComplete={'off'}
                    value={felter.fnr}
                    error={feil.fnr}
                    onChange={(event) => oppdater({ fnr: kunSiffer(event.target.value) })}
                />
            </HStack>
            <HStack gap={'space-12'}>
                <Button type={'button'} variant={'primary'} size={'small'} onClick={leggTil}>
                    {'Legg til'}
                </Button>
                <Button type={'button'} variant={'tertiary'} size={'small'} onClick={lukk}>
                    {'Avbryt'}
                </Button>
            </HStack>
        </VStack>
    );
};

// Beholdes som tekst slik at ledende 0 ikke forsvinner.
const kunSiffer = (verdi: string): string => verdi.replace(/\D/g, '').slice(0, 11);

const validerFelter = (felter: Felter): Feil => {
    const feil: Feil = {};

    if (!felter.fornavn.trim()) {
        feil.fornavn = 'Du må fylle ut fornavn';
    }

    if (!felter.etternavn.trim()) {
        feil.etternavn = 'Du må fylle ut etternavn';
    }

    if (!felter.fødselsdato) {
        feil.fødselsdato = 'Du må velge fødselsdato';
    } else if (felter.fødselsdato > dateTilISOTekst(new Date())) {
        feil.fødselsdato = 'Fødselsdato kan ikke være etter dagens dato';
    }

    const fnr = felter.fnr.trim();

    if (fnr && !/^\d{11}$/.test(fnr)) {
        feil.fnr = 'Fødselsnummer må være 11 siffer';
    }

    return feil;
};
