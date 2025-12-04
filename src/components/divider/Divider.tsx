const Divider = ({
    orientation = 'horizontal',
    color = 'gray',
    thickness = 1,
    margin = undefined,
}: {
    orientation?: 'horizontal' | 'vertical';
    color?: 'gray' | 'black';
    thickness?: 1 | 2 | 3;
    margin?: string;
}) => {
    const colorValue = color === 'gray' ? 'var(--a-gray-300)' : 'var(--a-gray-900)';

    const style: React.CSSProperties = {
        backgroundColor: colorValue,
        margin: margin,
        ...(orientation === 'horizontal'
            ? {
                  width: '100%',
                  height: `${thickness}px`,
              }
            : {
                  width: `${thickness}px`,
                  height: '100%',
                  alignSelf: 'stretch',
              }),
    };

    return <div style={style} role="separator" aria-orientation={orientation} />;
};

export default Divider;
