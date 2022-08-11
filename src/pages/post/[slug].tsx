import Link from "next/link"
import type { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { ParsedUrlQuery } from "querystring"

import { query } from ".keystone/api"

interface Post {
  id: string
  title: string
  content: string
}

interface Props {
  post: Post
}

interface ContextParams extends ParsedUrlQuery {
  slug: string
}

const Post: NextPage<Props> = ({ post }) => {
  return (
    <div>
      <main style={{ margin: "3rem" }}>
        <div>
          <Link href="/">
            <a>&larr; back home</a>
          </Link>
        </div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await query.Post.findMany({ query: "slug" })
  const paths = posts.filter(({ slug }) => !!slug).map(({ slug }) => `/post/${slug}`)

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params as ContextParams

  const post = await query.Post.findOne({
    where: { slug: slug },
    query: "id title content"
  })

  if (!post) return { notFound: true }

  return { props: { post } }
}

export default Post
