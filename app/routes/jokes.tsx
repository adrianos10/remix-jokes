import {LinksFunction, LoaderFunction, useLoaderData} from 'remix'
import {Outlet, Link} from 'remix'
import stylesUrl from '../styles/jokes.css'
import {db} from '~/utils/db.server'
import type {Joke} from '@prisma/client'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ]
}

type LoaderData = {jokes: Pick<Joke, 'id' | 'name'>[]}
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokes: await db.joke.findMany({
      take: 5,
      select: {id: true, name: true},
      orderBy: {createdAt: 'desc'},
    }),
  }

  return data
}

export default function JokesRoute() {
  const {jokes} = useLoaderData<LoaderData>()

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {jokes.map(({id, name}) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
