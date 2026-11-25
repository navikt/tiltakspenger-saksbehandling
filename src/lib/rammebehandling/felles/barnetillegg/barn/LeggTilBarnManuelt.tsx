import { useState } from 'react';
import { Button, HStack, TextField, VStack } from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';
import {
    BarnetilleggBarnSkjema,
    erSammeBarn,
    tilBarnetilleggBarnSkjema,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { IkkeSladdetVerdi } from '~/types/SladdetVerdi';

type Felter = {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    fødselsdato: Nullable<Dato>;
};

type Feil = Partial<Record<keyof Felter, string>>;

const TOMT_SKJEMA: Felter = {
    fornavn: '',
    mellomnavn: '',
    etternavn: '',
    fødselsdato: null,
};

type Props = {
    eksisterendeBarn: BarnetilleggBarnSkjema[];
    onLeggTil: (barn: BarnetilleggBarnSkjema) => void;
    onAvbryt: () => void;
};

/** Barn som ikke finnes i folkeregisteret legges til med navn og fødselsdato, uten fnr. */
export const LeggTilBarnManuelt = ({ eksisterendeBarn, onLeggTil, onAvbryt }: Props) => {
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
                fnr: { erSladdet: false, verdi: null },
                fornavn: tekst(felter.fornavn),
                mellomnavn: tekst(felter.mellomnavn),
                etternavn: tekst(felter.etternavn),
                fødselsdato: { erSladdet: false, verdi: felter.fødselsdato },
                kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
                søknadId: null,
                perioder: null,
            },
            uuidv4(),
        );

        if (eksisterendeBarn.some((it) => erSammeBarn(it, barn))) {
            setFeil({ fornavn: 'Barnet finnes allerede i listen' });
            return;
        }

        onLeggTil(barn);
    };

    return (
        <VStack gap={'space-16'}>
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
            <HStack gap={'space-12'}>
                <Button type={'button'} variant={'primary'} size={'small'} onClick={leggTil}>
                    {'Legg til'}
                </Button>
                <Button type={'button'} variant={'tertiary'} size={'small'} onClick={onAvbryt}>
                    {'Avbryt'}
                </Button>
            </HStack>
        </VStack>
    );
};

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

    return feil;
};
