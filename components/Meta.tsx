import Head from 'next/head'
import { Common } from 'constants/common'

const Meta = (): JSX.Element => {
  return (
    <Head>
      <title>{Common.APP_NAME}</title>
      <meta name="description" content="Book an appointment with the doctor of your choice!" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="viewport-fit=cover, initial-scale=1.0, width=device-width, height=device-height, user-scalable=no"
      />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#5B4B8A" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#4C3575" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default Meta
