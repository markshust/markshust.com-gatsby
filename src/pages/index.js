import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "@components/layout"
import SEO from "@components/seo"
import Newsletter from "@components/newsletter"
import markshustAvatar from "@assets/markshust-avatar.jpg"

class IndexIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={siteDescription} />
        <div className="relative py-8 bg-white overflow-hidden">
          <img
            className="rounded-full h-48 h-48 lg:h-64 lg:w-64 mx-auto"
            src={markshustAvatar}
            alt="Mark Shust"
          />
          <h1 className="mb-8 text-3xl text-center font-extrabold tracking-tight text-gray-900 sm:text-5xl pb-4">
            Hey, I'm Mark!{" "}
            <span role="img" aria-label="Wave">
              👋
            </span>
          </h1>
          <div className="prose text-gray-700 prose-lg">
            <p>
              I’ve been following Magento since the early days (version 0.8?).
              Before Magento, I was an experienced PHP developer with a number
              of development agencies. Eventually, I learned enough to become a{" "}
              <a
                href="https://www.zend-zce.com/en/yellow-pages/ZEND014633"
                target="_blank"
                rel="noreferrer"
              >
                Zend Certified Engineer
              </a>
              .
            </p>
            <p>
              Once I started developing full time in Magento, around version
              1.4, I quickly realized this framework was special, and wanted to
              learn everything about it. I flew out to Culver City and got
              trained at Magento Inc.’s headquarters, and the bug bit me.
            </p>
            <p>
              On the flight home, I knew I’d be involved with Magento for a long
              time. I wanted to deliver exceptional work to my clients, so I
              learned everything I could. I created a number of Magento modules,
              gained experience as a solution architect, and even gave a speech
              at Magento Imagine in Las Vegas.
            </p>
            <p>
              Years passed, and my passion has only grown since those early
              years, eventually becoming an{" "}
              <a
                href="https://www.youracclaim.com/users/mark-shust"
                target="_blank"
                rel="noreferrer"
              >
                Adobe Certified Magento Developer
              </a>
              . I got quite involved with Docker in my early years of trying to
              setup Magento 2 on my Mac, which eventually became{" "}
              <a
                href="https://github.com/markshust/docker-magento"
                target="_blank"
                rel="noreferrer"
              >
                the most popular development environment for Magento 2
              </a>
              .
            </p>
            <p>
              As the repository grew in popularity, I became quite versed with{" "}
              <a
                href="https://courses.m.academy/p/build-twelve-factor-node-js-app-docker"
                target="_blank"
                rel="noreferrer"
              >
                building 12 Factor Apps with Docker
              </a>
              , and even gave another speech at Meet Magento in New York.
            </p>
            <p>
              As usage for the project grew, so did the number of questions I
              received about it. I decided to put together a collection of
              lessons to teach all of the concepts for{" "}
              <a
                href="https://m.academy/courses/setup-magento-2-development-environment-docker"
                target="_blank"
                rel="noreferrer"
              >
                setting up a Magento 2 Development environment with Docker
              </a>
              . This course became the first contribution to{" "}
              <a href="https://m.academy" target="_blank" rel="noreferrer">
                M.academy
              </a>
              , a training resource I put together to teach everything I know
              about Magento to others.
            </p>
            <p>
              Over the years my passion has changed from consultant to teacher.
              I’m obsessed with teaching others all of the special techniques &
              tricks I learned over all these years.
            </p>
            <p>
              My wish is that you learn to love Magento as much as I do, and
              became a great developer or architect at that. I promise to do my
              best, and hope that one day you can{" "}
              <Link to="/2019/10/29/let-magento-kill-you/">
                let Magento kill you
              </Link>{" "}
              too.
            </p>
            <p>
              Keep coding,
              <br />- Mark
            </p>
          </div>
        </div>
        <Newsletter />
      </Layout>
    )
  }
}

export default IndexIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`
