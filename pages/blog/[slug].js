import Head from 'next/head'
// import Link from 'next/link'
import sanityClient from '../../sanityClient'
import styles from '../../styles/Home.module.css'

export default function BlogPost({ title, likes, name, _id}) {
  const [ likeState, setLikes ] = React.useState(likes)

  const addLike = async () => {
    const {likes: newLikes} = await fetch('/api/handle-like', {
      method: 'POST',
      body: JSON.stringify({ _id }),
    }).then((response) => response.json());

    setLikes(newLikes)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p>posted by {name}</p>
        <button onClick={addLike}>{likeState} likes</button>
      </main>
    </div>
  )
}

export async function getStaticProps({ params}) {
  const slug = params.slug;
  const [post] = await sanityClient.fetch(`
  *[_type == 'post' && slug.current == '${slug}']{
    _id,
    title,
    'slug': slug.current,
    'name': author->name,
    likes
  }
`);
  return { props: { ...post} }
}

export async function getStaticPaths() {
  const posts = await sanityClient.fetch(`
    *[_type == 'post']{
      'slug': slug.current 
    }
  `);

  return {
    paths: posts.map(({ slug }) => `/blog/${slug}`),
    fallback: false
  }
}