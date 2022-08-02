import Link from 'next/link';

// Icons
import { FiUser, FiCalendar } from 'react-icons/fi';

// Types
import { Post } from '../../pages';

// Style
import styles from './postPreview.module.scss';

interface PostPreviewProps {
  post: Post;
}
export default function PostPreview({ post }: PostPreviewProps): JSX.Element {
  const { last_publication_date, data, uid } = post;
  return (
    <div className={styles.card}>
      <Link href={`/post/${uid}`}>
        <a>
          <h2>{data.title}</h2>
        </a>
      </Link>
      <p>{data.subtitle}</p>
      <section>
        <div>
          <FiCalendar />
          <span>{last_publication_date}</span>
        </div>
        <div>
          <FiUser />
          <span>{data.author}</span>
        </div>
      </section>
    </div>
  );
}
