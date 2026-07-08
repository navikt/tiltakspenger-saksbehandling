export const parseMultipartPdfs = async (response: Response): Promise<Blob[]> => {
    const boundary = response.headers.get('content-type')?.split('boundary=')[1];
    if (!boundary) {
        throw new Error('No boundary found in content-type header');
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const encoder = new TextEncoder();

    const boundaryBytes = encoder.encode(`--${boundary}`);

    const findBoundaries = (data: Uint8Array, delimiter: Uint8Array): number[] => {
        const positions: number[] = [];
        outer: for (let i = 0; i < data.length - delimiter.length; i++) {
            for (let j = 0; j < delimiter.length; j++) {
                if (data[i + j] !== delimiter[j]) continue outer;
            }
            positions.push(i);
        }
        return positions;
    };

    const boundaryPositions = findBoundaries(bytes, boundaryBytes);

    return boundaryPositions.slice(0, -1).map((start, i) => {
        const end = boundaryPositions[i + 1];
        const part = bytes.slice(start + boundaryBytes.length, end);

        const headerEnd = part.findIndex(
            (_, i) =>
                part[i] === 0x0d &&
                part[i + 1] === 0x0a &&
                part[i + 2] === 0x0d &&
                part[i + 3] === 0x0a,
        );
        const body = part.slice(headerEnd + 4, -2);

        return new Blob([body], { type: 'application/pdf' });
    });
};
