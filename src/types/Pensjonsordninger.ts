import { Utfall } from './Utfall';
import { Vilkårsvurdering } from './Søknad';
import { ÅpenPeriode } from './Periode';

class Pensjonsordninger {
  samletUtfall: Utfall;
  perioder: Vilkårsvurdering[];

  constructor(pensjonsordninger: any) {
    this.samletUtfall = pensjonsordninger.samletUtfall;
    this.perioder = pensjonsordninger.perioder;
  }

  finnPensjonsordningerOppgittISøknaden(): ÅpenPeriode[] {
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

export default Pensjonsordninger;
