import { FørstegangsbehandlingData, VilkårsettDTO } from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';

export const vilkårTabs = (vilkårsett: VilkårsettDTO) => [
    {
        tittel: 'Krav fremmet innen frist',
        url: 'kravfrist',
        paragraf: '§11',
        utfall: vilkårsett.kravfristVilkår.samletUtfall,
    },
    {
        tittel: 'Tiltaksdeltagelse',
        url: 'tiltaksdeltagelse',
        paragraf: '§2',
        utfall: vilkårsett.tiltakDeltagelseVilkår.samletUtfall,
    },
    {
        tittel: 'Over 18 år',
        url: 'alder',
        paragraf: '§3',
        utfall: vilkårsett.alderVilkår.samletUtfall,
    },
    {
        tittel: 'Forholdet til andre ytelser',
        url: 'andreytelser',
        paragraf: '§7',
        utfall: vilkårsett.livsoppholdVilkår.samletUtfall,
    },
    {
        tittel: 'Kvalifiseringsprogrammet',
        url: 'kvp',
        paragraf: '§7',
        utfall: vilkårsett.kvpVilkår.samletUtfall,
    },
    {
        tittel: 'Introduksjonsprogrammet',
        url: 'intro',
        paragraf: '§7',
        utfall: vilkårsett.introVilkår.samletUtfall,
    },
    {
        tittel: 'Opphold i institusjon',
        url: 'institusjonsopphold',
        paragraf: '§9',
        utfall: vilkårsett.institusjonsoppholdVilkår.samletUtfall,
    },
];

export const hentTiltaksPeriode = (behandling: FørstegangsbehandlingData): Periode => {
    return {
        fraOgMed:
            behandling.saksopplysninger.tiltaksdeltagelse.deltagelseFraOgMed ??
            behandling.søknad.tiltak.fraOgMed,
        tilOgMed:
            behandling.saksopplysninger.tiltaksdeltagelse.deltagelseTilOgMed ??
            behandling.søknad.tiltak.tilOgMed,
    };
};
