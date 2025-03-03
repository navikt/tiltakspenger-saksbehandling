import { SøknadBarn } from '../../../../types/SøknadTypes';
import { BodyShort } from '@navikt/ds-react';
import { Fragment } from 'react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { formaterDatotekst } from '../../../../utils/date';

type Props = {
    barn: SøknadBarn[];
    className?: string;
};

export const SøknadOpplysningerBarn = ({ barn, className }: Props) => {
    if (barn.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <BodyShort>{'Barn:'}</BodyShort>
            {barn.map((barn, index) => (
                <Fragment key={`${barn.fødselsdato}-${index}`}>
                    <BehandlingSaksopplysning
                        navn={'Navn'}
                        verdi={[barn.fornavn, barn.mellomnavn, barn.etternavn]
                            .filter(Boolean)
                            .join(' ')}
                    />
                    <BehandlingSaksopplysning
                        navn={'Fødselsdato'}
                        verdi={formaterDatotekst(barn.fødselsdato)}
                    />
                    <BehandlingSaksopplysning
                        navn={'Oppholder seg i Norge/EØS?'}
                        verdi={barn.oppholderSegIEØS ? 'Ja' : 'Nei'}
                    />
                    <BehandlingSaksopplysning navn={'Kilde'} verdi={barn.kilde} spacing={true} />
                </Fragment>
            ))}
        </div>
    );
};
