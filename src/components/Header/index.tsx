import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={`${commonStyles.responsiveContainer} ${styles.menu}`}>
      <Link href="/" passHref>
        <img src="/images/Logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
