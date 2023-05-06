import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string;
  const graphQLClient = new GraphQLClient(endpoint);
  const pathArr = ctx.query.postpath as Array<string>;
  const path = pathArr.join('/');

  const query = gql`
    {
      post(id: "${path}", idType: SLUG) {
        id
        excerpt
        title
        link
        dateGmt
        modifiedGmt
        content
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  if (!data.post) {
    return {
      notFound: true,
    };
  }
  
  // redirect to permalink
  return {
    redirect: {
      permanent: true,
      destination: data.post.link,
    },
  };
};

interface PostProps {
  post: any;
}

const Post: React.FC<PostProps> = () => {
  return null;
};

export default Post;
