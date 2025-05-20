import { PosteringForDag } from '../../../../types/Simulering';
import { formaterDatotekst } from '../../../../utils/date';
import { OppsummeringsPar } from '../../oppsummeringspar/OppsummeringsPar';

const OppsummeringAvPosteringForDag = (props: {
    postering: PosteringForDag;
    visDato?: boolean;
}) => {
    return (
        <div>
            {props.visDato && (
                <OppsummeringsPar
                    label={'Dato'}
                    variant="inlineColon"
                    verdi={formaterDatotekst(props.postering.dato)}
                />
            )}
            <OppsummeringsPar
                label={'Fagområde'}
                variant="inlineColon"
                verdi={props.postering.fagområde}
            />
            <OppsummeringsPar
                label={'Klassekode'}
                variant="inlineColon"
                verdi={props.postering.klassekode}
            />
            <OppsummeringsPar label={'Type'} variant="inlineColon" verdi={props.postering.type} />
            <OppsummeringsPar label={'Beløp'} variant="inlineColon" verdi={props.postering.beløp} />
        </div>
    );
};

export default OppsummeringAvPosteringForDag;
