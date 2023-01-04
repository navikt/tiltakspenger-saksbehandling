import { rest } from 'msw';

export const handlers = [
    rest.get('/api/saksbehandler', (_req, res, ctx) => {
        return res(
            ctx.json({
                navIdent: 'Z123456',
                brukernavn: 'test testesen',
                epost: 'test.testesen@nav.no',
                roller: ['SAKSBEHANDLER'],
            })
        );
    }),
    rest.post('/api/soker', (_req, res, ctx) => {
        return res(ctx.json({ id: 'soker_01GM5VXJWHW6641HDPYVDK0K3G' }));
    }),
    rest.get('/api/person/soknader/*', (_req, res, ctx) => {
        return res(
            ctx.json({
                ident: '23918199063',
                behandlinger: [
                    {
                        søknad: {
                            id: 'soknad_01GM5W411YWTE41EWZ9Y6Y0HK2',
                            søknadId: '14172',
                            søknadsdato: '2022-12-13',
                            arrangoernavn: 'NAV AURSKOG HØLAND',
                            tiltakskode: 'Individuell jobbstøtte (IPS)',
                            beskrivelse: null,
                            startdato: '2022-10-01',
                            sluttdato: '2023-02-01',
                            antallDager: null,
                            fritekst: null,
                            vedlegg: [
                                { journalpostId: '573810978', dokumentInfoId: '599116066', filnavn: "CV'en min" },
                                {
                                    journalpostId: '573810978',
                                    dokumentInfoId: '599116069',
                                    filnavn: "CV'en til kona mi",
                                },
                            ],
                        },
                        registrerteTiltak: [
                            {
                                arrangør: 'NAV Aurskog-Høland',
                                navn: 'Individuell jobbstøtte (IPS)',
                                periode: { fra: '2022-10-01', til: '2023-02-01' },
                                prosent: 60,
                                dagerIUken: 3,
                                status: 'Gjennomføres',
                            },
                            {
                                arrangør: 'Helgeland Industrier Sandnessjøen AFT',
                                navn: 'Gruppe AMO',
                                periode: { fra: '2022-07-01', til: '2022-12-30' },
                                prosent: 40,
                                dagerIUken: 2,
                                status: 'Aktuell',
                            },
                        ],
                        vurderingsperiode: { fra: '2022-10-01', til: '2023-02-01' },
                        tiltakspengerYtelser: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        statligeYtelser: {
                            samletUtfall: 'KreverManuellVurdering',
                            aap: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                            dagpenger: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '104 uker (520 dager) igjen',
                                    periode: { fra: '2022-08-01', til: null },
                                    kreverManuellVurdering: true,
                                    utfall: 'KreverManuellVurdering',
                                },
                            ],
                        },
                        kommunaleYtelser: {
                            samletUtfall: 'Oppfylt',
                            kvp: [
                                {
                                    kilde: 'Søknad',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                            introProgrammet: [
                                {
                                    kilde: 'Søknad',
                                    detaljer: 'Ikke relevant',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        pensjonsordninger: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        lønnsinntekt: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'A-Inntekt',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'IkkeImplementert',
                                },
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        institusjonsopphold: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        barnetillegg: [
                            {
                                navn: 'TREIG HISTOLOG',
                                alder: 4,
                                fødselsdato: '2018-03-14',
                                bosatt: 'NOR',
                                kilde: 'Søknad',
                                utfall: 'Oppfylt',
                                søktBarnetillegg: true,
                            },
                            {
                                navn: 'UTGÅTT BART',
                                alder: 14,
                                fødselsdato: '2007-12-15',
                                bosatt: 'NOR',
                                kilde: 'Søknad',
                                utfall: 'Oppfylt',
                                søktBarnetillegg: false,
                            },
                        ],
                    },
                    {
                        søknad: {
                            id: 'soknad_01GM5VXJS8FQXJ0X2SYBGW0VJ5',
                            søknadId: '14171',
                            søknadsdato: '2022-12-13',
                            arrangoernavn: 'HELGELAND INDUSTRIER AS',
                            tiltakskode: 'Gruppe AMO',
                            beskrivelse: null,
                            startdato: '2022-07-01',
                            sluttdato: '2022-12-30',
                            antallDager: null,
                            fritekst: null,
                            vedlegg: [],
                        },
                        registrerteTiltak: [
                            {
                                arrangør: 'NAV Aurskog-Høland',
                                navn: 'Individuell jobbstøtte (IPS)',
                                periode: { fra: '2022-10-01', til: '2023-02-01' },
                                prosent: 60,
                                dagerIUken: 3,
                                status: 'Gjennomføres',
                            },
                            {
                                arrangør: 'Helgeland Industrier Sandnessjøen AFT',
                                navn: 'Gruppe AMO',
                                periode: { fra: '2022-07-01', til: '2022-12-30' },
                                prosent: 40,
                                dagerIUken: 2,
                                status: 'Aktuell',
                            },
                        ],
                        vurderingsperiode: { fra: '2022-07-01', til: '2022-12-30' },
                        tiltakspengerYtelser: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        statligeYtelser: {
                            samletUtfall: 'KreverManuellVurdering',
                            aap: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                            dagpenger: [
                                {
                                    kilde: 'Arena',
                                    detaljer: '104 uker (520 dager) igjen',
                                    periode: { fra: '2022-08-01', til: null },
                                    kreverManuellVurdering: true,
                                    utfall: 'KreverManuellVurdering',
                                },
                            ],
                        },
                        kommunaleYtelser: {
                            samletUtfall: 'Oppfylt',
                            kvp: [
                                {
                                    kilde: 'Søknad',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                            introProgrammet: [
                                {
                                    kilde: 'Søknad',
                                    detaljer: 'Ikke relevant',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        pensjonsordninger: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        lønnsinntekt: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'A-Inntekt',
                                    detaljer: '',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'IkkeImplementert',
                                },
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        institusjonsopphold: {
                            samletUtfall: 'Oppfylt',
                            perioder: [
                                {
                                    kilde: 'SØKNAD',
                                    detaljer: 'Svart NEI i søknaden',
                                    periode: null,
                                    kreverManuellVurdering: false,
                                    utfall: 'Oppfylt',
                                },
                            ],
                        },
                        barnetillegg: [
                            {
                                navn: 'TREIG HISTOLOG',
                                alder: 4,
                                fødselsdato: '2018-03-14',
                                bosatt: 'NOR',
                                kilde: 'Søknad',
                                utfall: 'Oppfylt',
                                søktBarnetillegg: true,
                            },
                            {
                                navn: 'UTGÅTT BART',
                                alder: 14,
                                fødselsdato: '2007-12-15',
                                bosatt: 'NOR',
                                kilde: 'Søknad',
                                utfall: 'Oppfylt',
                                søktBarnetillegg: false,
                            },
                        ],
                    },
                ],
                personopplysninger: {
                    fornavn: 'RAFFINERT',
                    etternavn: 'BEUNDRING',
                    ident: '23918199063',
                    barn: [],
                    fortrolig: false,
                    strengtFortrolig: false,
                    skjermet: false,
                },
            })
        );
    }),
];
