import Link from 'next/link';

// Icons
import { FiUser, FiCalendar } from 'react-icons/fi';

// Types
import { Post } from '../../pages';

// Style
import styles from './postView.module.scss';

interface PostViewProps {
  post: Post;
}
export default function PostView({ post }: PostViewProps): JSX.Element {
  const { first_publication_date, data, uid } = post;
  return <div className={styles.card} />;
}
