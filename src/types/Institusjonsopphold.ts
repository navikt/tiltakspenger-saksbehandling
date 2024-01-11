import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class Institusjonsopphold {
  samletUtfall: Utfall;
  perioder: Vilkårsvurdering[];

  constructor(institusjonsopphold: any) {
    this.samletUtfall = institusjonsopphold.samletUtfall;
    this.perioder = institusjonsopphold.perioder;
  }

  finnInstitusjonsoppholdOppgittISøknaden(): ÅpenPeriode[] {
    const defaultArray: ÅpenPeriode[] = [];
    const allePerioder = this.perioder.slice();
    return allePerioder.reduce((perioder, { utfall, periode, kilde }) => {
      if (
        Utfall.KreverManuellVurdering === utfall &&
        kilde?.toLowerCase() === 'søknad'
      ) {
        perioder.push(periode);
        return perioder;
      }
      return perioder;
    }, defaultArray);
  }
}

export default Institusjonsopphold;
