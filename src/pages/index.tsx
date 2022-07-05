import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';

// Components
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results } = postsPagination;
  return (
    <>
      <Head>
        <title>{'</> Spacetraveling'} </title>
      </Head>
      <Header />
      <main className={commonStyles.responsiveContainer}>
        <div className={`${styles.posts}`}>
          {results.map(post => (
            <PostPreview key={post.uid} post={post} />
          ))}
        </div>
      </main>
      <footer
        className={`${commonStyles.responsiveContainer} ${styles.footer}`}
      >
        <Link href="/">
          <a>Carregar mais posts</a>
        </Link>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic
    .getByType('posts')
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });

  const posts: Post[] = postsResponse.results.map((post: Post) => {
    return {
      ...post,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};
