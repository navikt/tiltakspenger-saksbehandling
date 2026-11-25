import { FormEvent, useMemo, useState } from 'react';
import { BodyShort, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import {
    BarnetilleggBarnSkjema,
    erSammeBarn,
    formaterBarnNavn,
    kunSiffer,
    tilBarnetilleggBarnSkjema,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { useHentBarnFraFolkeregister } from '~/lib/rammebehandling/felles/barnetillegg/barn/useHentBarnFraFolkeregister';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { formaterSladdbarDatotekst } from '~/utils/date';
import { erSladdet, sladdbarTekst } from '~/utils/sladdetVerdi';

type Props = {
    sakId: SakId;
    behandlingId: RammebehandlingId;
    eksisterendeBarn: BarnetilleggBarnSkjema[];
    onLeggTil: (barn: BarnetilleggBarnSkjema) => void;
    onAvbryt: () => void;
};

/** Barn slås opp i folkeregisteret med fnr, og kan bare legges til hvis det er søkers barn. */
export const LeggTilBarnFraFolkeregister = ({
    sakId,
    behandlingId,
    eksisterendeBarn,
    onLeggTil,
    onAvbryt,
}: Props) => {
    const [fnr, setFnr] = useState('');
    const [fnrFeil, setFnrFeil] = useState<string>();

    const { trigger, data, error, isMutating, reset } = useHentBarnFraFolkeregister(
        sakId,
        behandlingId,
    );

    const barn = useMemo(() => (data ? tilBarn(data) : null), [data]);
    const finnesAllerede = !!barn && eksisterendeBarn.some((it) => erSammeBarn(it, barn));

    const hent = (event: FormEvent) => {
        event.preventDefault();
        reset();

        if (!/^\d{11}$/.test(fnr)) {
            setFnrFeil('Fødselsnummer må være 11 siffer');
            return;
        }

        trigger({ fnr });
    };

    return (
        <VStack gap={'space-16'}>
            <form onSubmit={hent}>
                <HStack gap={'space-12'} align={'end'}>
                    <TextField
                        label={'Fødselsnummer'}
                        size={'small'}
                        inputMode={'numeric'}
                        autoComplete={'off'}
                        value={fnr}
                        error={fnrFeil}
                        onChange={(event) => {
                            setFnr(kunSiffer(event.target.value));
                            setFnrFeil(undefined);
                            reset();
                        }}
                    />
                    <Button
                        type={'submit'}
                        variant={'secondary'}
                        size={'small'}
                        loading={isMutating}
                    >
                        {'Hent'}
                    </Button>
                </HStack>
            </form>

            {error && (
                <Infokort variant={'feil'}>
                    {error.status === 404
                        ? error.message
                        : 'Kunne ikke hente barnet fra folkeregisteret. Prøv igjen.'}
                </Infokort>
            )}

            {data && barn && (
                <VStack gap={'space-8'}>
                    <BodyShort size={'small'}>
                        {`${formaterBarnNavn(barn) || 'Navn skjult'}, født ${formaterSladdbarDatotekst(barn.fødselsdato)}`}
                    </BodyShort>
                    {(data.fortrolig || data.strengtFortrolig || data.strengtFortroligUtland) && (
                        <Infokort variant={'advarsel'}>
                            {`Barnet har ${data.strengtFortrolig || data.strengtFortroligUtland ? 'strengt ' : ''}fortrolig adresse`}
                        </Infokort>
                    )}
                    {finnesAllerede && (
                        <Infokort variant={'feil'}>{'Barnet finnes allerede i listen'}</Infokort>
                    )}
                    {erSladdet(barn.fødselsdato) && (
                        <Infokort variant={'feil'}>
                            {'Barnet har sladdede opplysninger, og kan ikke legges til'}
                        </Infokort>
                    )}
                </VStack>
            )}

            <HStack gap={'space-12'}>
                <Button
                    type={'button'}
                    variant={'primary'}
                    size={'small'}
                    disabled={!barn || finnesAllerede || erSladdet(barn.fødselsdato)}
                    onClick={() => barn && onLeggTil(barn)}
                >
                    {'Legg til barnet'}
                </Button>
                <Button type={'button'} variant={'tertiary'} size={'small'} onClick={onAvbryt}>
                    {'Avbryt'}
                </Button>
            </HStack>
        </VStack>
    );
};

const tilBarn = (person: Personopplysninger): BarnetilleggBarnSkjema =>
    tilBarnetilleggBarnSkjema(
        {
            fnr: person.fnr,
            fornavn: person.fornavn,
            mellomnavn: person.mellomnavn,
            etternavn: person.etternavn,
            fødselsdato: person.fødselsdato,
            kilde: BarnetilleggBarnKilde.FOLKEREGISTER,
            søknadId: null,
            perioder: null,
        },
        sladdbarTekst(person.fnr),
    );
