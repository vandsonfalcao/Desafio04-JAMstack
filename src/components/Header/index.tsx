import Image from 'next/image';
import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={commonStyles.responsiveContainer}>
      <div className={styles.menu}>
        <Link href="/" passHref>
          <Image src="/images/Logo.svg" width="238.62px" height="25.63px" />
        </Link>
      </div>
    </header>
  );
}
