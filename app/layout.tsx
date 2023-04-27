import { ReactNode } from 'react'
import { Common } from 'constantss'

const RootLayout = (props: { children: ReactNode }): JSX.Element => {
  return (
    <html dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <title>{Common.APP_NAME}</title>
        <meta name="description" content="Book an appointment with the doctor of your choice!" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F1F5F9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1B1C22" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{props.children}</body>
    </html>
  )
}

export default RootLayout
