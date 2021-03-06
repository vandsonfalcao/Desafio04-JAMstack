import { useState } from 'react';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  const { results, next_page } = postsPagination;
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextLink, setNextLink] = useState(next_page);

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
          {posts.map(post => (
            <PostPreview key={post.uid} post={post} />
          ))}
        </div>
      </main>
      <footer
        className={`${commonStyles.responsiveContainer} ${styles.footer}`}
      >
        <button
          type="button"
          onClick={() => {
            if (nextLink) {
              fetch(nextLink)
                .then(response => response.json())
                .then((data: PostPagination) => {
                  data.results.forEach(post => {
                    setPosts(prev => [
                      ...prev,
                      {
                        ...post,
                        first_publication_date: format(
                          new Date(post.first_publication_date),
                          'dd MMM yyy',
                          {
                            locale: ptBR,
                          }
                        ),
                      },
                    ]);
                  });
                  setNextLink(data.next_page);
                });
            }
          }}
        >
          {nextLink ? 'Carregar mais posts' : 'N??o h?? mais posts ????'}
        </button>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic
    .getByType('posts', {
      pageSize: 3,
      orderings: {
        field: 'last_publication_date',
        direction: 'desc',
      },
    })
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });

  const posts: Post[] = postsResponse.results.map((post: Post) => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyy',
        {
          locale: ptBR,
        }
      ),
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
