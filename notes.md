### Collecting Form Values in Netlify

The following has to be added in the form and input properties in order to enable Netlify form collection

```jsx
          <form
            action="/success"
            className="contact-form"
            name="mdx-contact"
            method="post"
            netlify-honeypot="bot-field"
            data-netlify="true"
          >
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="mdx-contact" />
```

### Setting up Multiple Posts

To set up multiple posts, we first created the posts subdirectory and within it, each folder holds a subdirectory for images and the post.mdx file which is the post itself. We then add a new filesystem instance to gatsby-config.

```jsx
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
```

### Frontmatter

The frontmatter is the information about the post that wouldn't be rendered. It is important to note that the data field should have the format listed below, because under the hood it uses moment.js, which will affect how we will query it with graphQL.

```js
---
title: Gatsby Tutorial
slug: gatsby-tutorial
image: ./images/gatsby-1.png
date: 2021-09-06
author: demiglace
category: gatsby
readTime: 34
---
```

The frontmatter can be queried via GraphQL. In the example below, the query queries for the 3 latest posts.

```jsx
export const query = graphql`
  {
    allMdx(limit: 3, sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        id
        excerpt
        frontmatter {
          title
          slug
          author
          category
          readTime
          date(formatString: "MMMM, Do YYYY")
          image {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
`
```

### Creating Post Pages Programmatically

We first set up the query with the unique value, slug, which we pass on to gatsby-node.js.

```js
const path = require('path')

// create pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx {
        nodes {
          frontmatter {
            slug
          }
        }
      }
      
    }
  `)

  result.data.allMdx.nodes.forEach((node) => {
    const slug = node.frontmatter.slug
    createPage({
      path: `/posts/${slug}`,
      component: path.resolve(`src/templates/post-template.js`),
      context: {
        slug,
      },
    })
  })

  
}

```

We export the createPages function wherein there are two arguments: graphql and actions. From actions we destructure **createPage**. We then iterate through the array's nodes and create a page with path `/posts/slug` for each node. We make use of the post-template file as the template and pass into it the slug.

We now then use this slug data to create another query for a single post for our post-template.js file.

```jsx
export const query = graphql`
query getSinglePost($slug: String) {
  mdx(frontmatter: {slug: {eq: $slug}}) {
    frontmatter {
      category
      date(formatString: "MMMM Do, YYYY")
      slug
      title
      readTime
      image {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    body
  }
}
`
```

The mdx post resides in the body endpoint of the query, and to render it, we need to use the **MDXRenderer** api from gatsby-plugin-mdx

```jsx
<MDXRenderer>
  {body}
</MDXRenderer>
```

