import Link from "next/link"
import type { NextPage } from "next"

import { query } from ".keystone/api"

interface Post {
  id: string
  title: string
  slug: string
}

interface Props {
  posts: Array<Post>
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <main style={{ margin: "3rem" }}>
        <h1>Hello World! 👋🏻 </h1>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link href={`/post/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const posts = await query.Post.findMany({ query: "id title slug" })
  return { props: { posts } }
}

export default Home
