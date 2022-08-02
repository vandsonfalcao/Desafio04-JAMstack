import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Carregando...</p>;
  }
  const { first_publication_date, data } = post;
  return (
    <>
      <Head>
        <title>{`${data.title} </> Spacetraveling.`}</title>
      </Head>
      <Header />
      <main>
        <section className={styles.banner}>
          <Image src={data.banner.url} alt={data.title} layout="fill" />
        </section>
        <div className={commonStyles.responsiveContainer}>
          <div className={styles.post}>
            <h1>{data.title}</h1>
            <div>
              <FiCalendar />
              <span>
                {format(new Date(first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </span>
              <FiUser />
              <span>{data.author}</span>
              <FiClock />
              <span>
                {Math.ceil(
                  data.content.reduce(
                    (acc, current) =>
                      acc +
                      RichText.asText(current.body).split(' ').length +
                      current.heading.split(' ').length,
                    0
                  ) / 200
                )}{' '}
                min
              </span>
            </div>
            <section>
              {data.content.map(group => (
                <div key={group.heading}>
                  <h2>{group.heading}</h2>
                  <div>
                    {group.body.map(paragraph => (
                      <p key={paragraph.text}>{paragraph.text}</p>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      <footer
        className={`${commonStyles.responsiveContainer} ${styles.footer}`}
      >
        <Link href="/">
          <a>Voltar</a>
        </Link>
      </footer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic
    .getByType('posts', {
      pageSize: 2,
    })
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });
  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const post = await prismic
    .getByUID('posts', String(slug), {})
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });

  return {
    props: {
      post,
    },
    revalidate: 60 * 5,
  };
};
