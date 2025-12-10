import React, { useEffect, useRef, useState } from 'react';
import {
    BodyShort,
    Button,
    Dropdown,
    HStack,
    InternalHeader,
    Loader,
    Search,
    Spacer,
    TextField,
} from '@navikt/ds-react';
import { LeaveIcon } from '@navikt/aksel-icons';
import { useHentSakForFNR } from './useHentSakForFNR';
import Varsel from '../varsel/Varsel';
import Link from 'next/link';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import router from 'next/router';
import Image from 'next/image';
import styles from './InternDekoratør.module.css';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { useHentEllerOpprettSak } from '~/components/interndekoratør/useHentEllerOpprettSak';

export const InternDekoratør = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { søk, error, reset } = useHentSakForFNR();
    const [søketekst, setSøketekst] = useState<string>('');
    const [fnr, setFnr] = useState<string>('');
    const [validationError, setValidationError] = useState<string>('');
    const modalRef = useRef<HTMLDialogElement>(null);
    const lukkModal = () => {
        setValidationError('');
        modalRef.current?.close();
    };
    const { hentEllerOpprettSak, isHentEllerOpprettSakMutating, hentEllerOpprettSakError } =
        useHentEllerOpprettSak();

    //window eksiterer ikke alltid ved lasting til å kunne brukes som en dependency for useEffect
    const windowPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useEffect(() => {
        reset();
        setSøketekst('');
    }, [windowPath]);

    return (
        <>
            <InternalHeader>
                <InternalHeader.Title as={Link} href="/">
                    Tiltakspenger
                </InternalHeader.Title>
                <HStack gap="8" align="center">
                    <form
                        role="search"
                        style={{
                            alignContent: 'center',
                            marginLeft: '20px',
                            minWidth: '17rem',
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            søk({ fnr: søketekst }).then((sak) => {
                                if (sak) {
                                    router.push(`/sak/${sak.saksnummer}`);
                                }
                            });
                        }}
                    >
                        <Search
                            label="InternalHeader søk"
                            size="small"
                            variant="secondary"
                            placeholder="Søk på fnr eller saksnummer"
                            value={søketekst}
                            onChange={(e) => setSøketekst(e.trim())}
                        >
                            <Search.Button className={styles.søkKnapp} />
                        </Search>
                    </form>
                    <Image
                        src="/christmas-season.svg"
                        alt="God jul illustrasjon"
                        aria-hidden
                        width={400}
                        height={45}
                        className={styles.logoResponsive}
                        priority
                    />
                </HStack>
                <Spacer />
                <HStack gap="4">
                    <Button
                        size={'small'}
                        type={'button'}
                        className={styles.opprettSakButton}
                        onClick={() => modalRef.current?.showModal()}
                    >
                        Opprett sak
                    </Button>
                    {innloggetSaksbehandler ? (
                        <Dropdown>
                            <InternalHeader.UserButton
                                as={Dropdown.Toggle}
                                name={innloggetSaksbehandler.navIdent}
                            />
                            <Dropdown.Menu>
                                <dl>
                                    <BodyShort as="dt" size="small">
                                        {innloggetSaksbehandler.navIdent}
                                    </BodyShort>
                                </dl>
                                <Dropdown.Menu.Divider />
                                <Dropdown.Menu.List>
                                    <Dropdown.Menu.List.Item as="a" href={'/oauth2/logout'}>
                                        Logg ut
                                        <Spacer />
                                        <LeaveIcon aria-hidden fontSize="1.5rem" />
                                    </Dropdown.Menu.List.Item>
                                </Dropdown.Menu.List>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Loader />
                    )}
                </HStack>
            </InternalHeader>
            {error && (
                <Varsel
                    melding={error.message ?? `Noe gikk galt ved henting av sak for "${søketekst}"`}
                    variant="error"
                    marginX
                    key={Date.now()}
                />
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                lukkModal={lukkModal}
                feil={hentEllerOpprettSakError}
                tittel={'Opprett sak'}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        type={'button'}
                        loading={isHentEllerOpprettSakMutating}
                        onClick={() => {
                            if (fnr.length !== 11) {
                                setValidationError('Fødselsnummer må være 11 siffer langt');
                                return;
                            }

                            hentEllerOpprettSak({ fnr }).then((response) => {
                                if (response) {
                                    setFnr('');
                                    lukkModal();
                                    router.push(`/sak/${response.saksnummer}`);
                                }
                            });
                        }}
                    >
                        Opprett sak
                    </Button>
                }
            >
                <HStack gap="4">
                    Her kan du opprette en sak for en person som ikke er registrert i systemet fra
                    før ved å skrive inn fødselsnummeret.
                    <TextField
                        label="Fødselsnummer"
                        value={fnr}
                        error={validationError}
                        onChange={(e) => {
                            if (e.target.value.length === 11) setValidationError('');
                            setFnr(e.target.value);
                        }}
                    />
                </HStack>
            </BekreftelsesModal>
        </>
    );
};
