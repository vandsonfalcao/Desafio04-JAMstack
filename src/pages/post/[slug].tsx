import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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
              <span>{first_publication_date}</span>
              <FiUser />
              <span>{data.author}</span>
              <FiClock />
              <span>{data.content.length * 5} min</span>
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
  // const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const postResponse = await prismic
    .getByUID('posts', String(slug), {})
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });

  const post = {
    ...postResponse,
    first_publication_date: format(
      new Date(postResponse.first_publication_date),
      'dd MMM yyy',
      {
        locale: ptBR,
      }
    ),
  };

  return {
    props: { post },
  };
};
