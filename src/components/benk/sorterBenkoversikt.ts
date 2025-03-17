import { BehandlingEllerSøknadForOversiktData } from '../../types/BehandlingTypes';

// Gruppperer behandlinger/søknader på fnr, og sorterer gruppene på eldste timestamp (kravtidspunkt eller opprettet tidspunkt)
export const sorterBenkoversikt = (
    søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[],
): BehandlingEllerSøknadForOversiktData[] => {
    return (
        Object.values(
            Object.groupBy(søknaderOgBehandlinger, ({ fnr }) => fnr),
        ) as BehandlingEllerSøknadForOversiktData[][]
    ) // "as" fordi groupBy return er typet som Partial<T>. fnr er alltid er definert så values her er aldri undefined
        .toSorted((behandlingerForFnrA, behandlingerForFnrB) =>
            sortByTimestamp(
                finnEldsteBehandling(behandlingerForFnrA),
                finnEldsteBehandling(behandlingerForFnrB),
            ),
        )
        .flatMap((behandlinger) => behandlinger.toSorted(sortByTimestamp));
};

const finnEldsteBehandling = (søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[]) =>
    søknaderOgBehandlinger.toSorted(sortByTimestamp).at(-1)!;

const getTimestamp = (søknadEllerBehandling: BehandlingEllerSøknadForOversiktData) =>
    søknadEllerBehandling.kravtidspunkt ?? søknadEllerBehandling.opprettet;

const sortByTimestamp = (
    a: BehandlingEllerSøknadForOversiktData,
    b: BehandlingEllerSøknadForOversiktData,
) => (getTimestamp(a) > getTimestamp(b) ? -1 : 1);
