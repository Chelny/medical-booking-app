import { ReactNode } from 'react'
import { Common } from 'constants/common'

const RootLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{Common.APP_NAME}</title>
        <meta name="description" content="Book an appointment with the doctor of your choice!" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#5B4B8A" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#4C3575" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
