// Speiler TiltakstypeSomGirRettDTO i tiltakspenger-libs. Backend fyller inn visningsnavnet.
export const tiltakstyperSomGirRett = [
    'ARBEIDSFORBEREDENDE_TRENING',
    'ARBEIDSMARKEDSOPPLAERING',
    'ARBEIDSRETTET_REHABILITERING',
    'ARBEIDSTRENING',
    'AVKLARING',
    'DIGITAL_JOBBKLUBB',
    'ENKELTPLASS_AMO',
    'ENKELTPLASS_VGS_OG_HØYERE_YRKESFAG',
    'FAG_OG_YRKESOPPLAERING',
    'FORSØK_OPPLÆRING_LENGRE_VARIGHET',
    'GRUPPE_AMO',
    'GRUPPE_VGS_OG_HØYERE_YRKESFAG',
    'HØYERE_UTDANNING',
    'HOYERE_YRKESFAGLIG_UTDANNING',
    'INDIVIDUELL_JOBBSTØTTE',
    'INDIVIDUELL_KARRIERESTØTTE_UNG',
    'JOBBKLUBB',
    'OPPFØLGING',
    'NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV',
    'STUDIESPESIALISERING',
    'UTVIDET_OPPFØLGING_I_NAV',
    'UTVIDET_OPPFØLGING_I_OPPLÆRING',
] as const;

// Kildens koder for lønnstilskudd, som fratar rett til tiltakspenger (se kodetabellene for FratarRett i tiltakspenger-libs).
export const lønnstilskuddstyper: { kode: string; navn: string }[] = [
    { kode: 'MIDLONTIL', navn: 'Midlertidig lønnstilskudd' },
    { kode: 'VARLONTIL', navn: 'Varig lønnstilskudd' },
    { kode: 'MIDLERTIDIG_LONNSTILSKUDD', navn: 'Midlertidig lønnstilskudd (Team Tiltak)' },
    { kode: 'VARIG_LONNSTILSKUDD', navn: 'Varig lønnstilskudd (Team Tiltak)' },
    {
        kode: 'FIREARIG_LONNSTILSKUDD',
        navn: 'Forskrift om forsøk med fireårig lønnstilskudd for unge',
    },
    { kode: 'FLEKSJOBB', navn: 'Fleksibel jobb - lønnstilskudd av lengre varighet' },
    { kode: 'LONNTILS', navn: 'Lønnstilskudd' },
    { kode: 'REAKTUFOR', navn: 'Lønnstilskudd - reaktivisering av uførepensjonister' },
    { kode: 'LONNTILL', navn: 'Lønnstilskudd av lengre varighet' },
    { kode: 'LONNTIL', navn: 'Tidsbegrenset lønnstilskudd' },
    { kode: 'TIDSUBLONN', navn: 'Tidsubestemt lønnstilskudd' },
    { kode: 'UFØREPENLØ', navn: 'Uførepensjon som lønnstilskudd' },
    { kode: 'LONNTILAAP', navn: 'Arbeidsavklaringspenger som lønnstilskudd' },
];

export const tiltakskilder = ['Arena', 'Komet', 'TeamTiltak'] as const;
export type Tiltakskilde = (typeof tiltakskilder)[number];
