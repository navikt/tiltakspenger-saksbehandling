import { originalPositionFor, TraceMap } from '@jridgewell/trace-mapping';
import type { SourceMapInput } from '@jridgewell/trace-mapping';

type StackFrame = {
    funksjon?: string;
    url: string;
    line: number;
    column: number;
};

// V8 (Chrome/Edge): "    at funksjon (https://.../fil.js:1:234)" eller "    at https://.../fil.js:1:234"
const V8_REGEX = /^(\s*at\s+)(?:(.*?)\s+\()?([^\s()]+):(\d+):(\d+)\)?\s*$/;
// Gecko/WebKit (Firefox/Safari): "funksjon@https://.../fil.js:1:234"
const GECKO_REGEX = /^(?:(.*?)@)?([^\s@]+):(\d+):(\d+)\s*$/;

const parseFrame = (linje: string): StackFrame | null => {
    const v8 = V8_REGEX.exec(linje);
    if (v8) {
        return { funksjon: v8[2], url: v8[3], line: Number(v8[4]), column: Number(v8[5]) };
    }

    const gecko = GECKO_REGEX.exec(linje);
    if (gecko) {
        return {
            funksjon: gecko[1] || undefined,
            url: gecko[2],
            line: Number(gecko[3]),
            column: Number(gecko[4]),
        };
    }

    return null;
};

// Sourcemaps peker på kilder på formen "turbopack:///[project]/src/fil.tsx" (eller
// "webpack://app/./src/fil.tsx" ved webpack-bygg) — stripp prefikset for lesbarhet
const ryddKilde = (kilde: string) =>
    kilde
        .replace(/^turbopack:\/\/+\[project\]\//, '')
        .replace(/^webpack:\/\/[^/]*\//, '')
        .replace(/^\.\//, '');

const formatFrame = (funksjon: string | undefined, sted: string) =>
    funksjon ? `    at ${funksjon} (${sted})` : `    at ${sted}`;

const SOURCE_MAPPING_URL_REGEX = /\/\/# sourceMappingURL=(\S+)\s*$/m;

const hentSourceMap = async (jsUrl: string): Promise<SourceMapInput | null> => {
    const res = await fetch(jsUrl);
    if (!res.ok) {
        return null;
    }

    // Turbopack gir ikke map-filene samme navn som bundlene (f.eks. "chunk-a.js" -> "chunk-b.js.map"),
    // så vi må lese sourceMappingURL-kommentaren i bundlen for å finne riktig map-fil
    const mapRef = SOURCE_MAPPING_URL_REGEX.exec(await res.text())?.[1];
    if (!mapRef) {
        return null;
    }

    if (mapRef.startsWith('data:')) {
        const base64 = mapRef.slice(mapRef.indexOf(',') + 1);
        return JSON.parse(atob(base64));
    }

    const mapRes = await fetch(new URL(mapRef, jsUrl));
    return mapRes.ok ? mapRes.json() : null;
};

const traceMapCache = new Map<string, Promise<TraceMap | null>>();

const hentTraceMap = (url: string): Promise<TraceMap | null> => {
    let cached = traceMapCache.get(url);

    if (!cached) {
        cached = hentSourceMap(url)
            .then((map) => (map ? new TraceMap(map) : null))
            .catch(() => null);
        traceMapCache.set(url, cached);
    }

    return cached;
};

/**
 * Mapper en rå stack-trace fra `error.stack` tilbake til original-kilden vha. sourcemapene som ligger ved
 * siden av js-bundlene (productionBrowserSourceMaps). Linjer som ikke kan mappes (f.eks. manglende
 * sourcemap, eller webpack-internal-urler i dev) returneres uendret.
 */
export const mapStackTrace = async (stack: string): Promise<string> => {
    const linjer = stack.split('\n');

    const mappet = await Promise.all(
        linjer.map(async (linje) => {
            const frame = parseFrame(linje);
            if (!frame) {
                return linje;
            }

            const traceMap = await hentTraceMap(frame.url);
            if (!traceMap) {
                return linje;
            }

            const original = originalPositionFor(traceMap, {
                line: frame.line,
                column: frame.column,
            });
            if (original.source == null || original.line == null) {
                return linje;
            }

            return formatFrame(
                original.name ?? frame.funksjon,
                `${ryddKilde(original.source)}:${original.line}:${original.column ?? 0}`,
            );
        }),
    );

    return mappet.join('\n');
};
