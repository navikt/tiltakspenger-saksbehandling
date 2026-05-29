import style from './Separator.module.css';
import { classNames } from '~/utils/classNames';

type Props = {
    className?: string;
};

export const Separator = ({ className }: Props) => {
    return <hr className={classNames(style.separator, className)} />;
};
