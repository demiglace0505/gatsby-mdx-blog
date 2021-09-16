import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Link } from 'gatsby'

const Categories = () => {
  const data = useStaticQuery(query)
  const {
    allMdx: { distinct: categories },
  } = data

  return (
    <ul className="categories">
      {categories.map((category, index) => {
        return (
          <li key={index}>
            <Link to={`/${category}`} className="category">
              {category}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const query = graphql`
  {
    allMdx {
      distinct(field: frontmatter___category)
    }
  }
`

export default Categories
