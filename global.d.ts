import { YogaInitialContext } from 'graphql-yoga'
import { Request, Response } from 'express'

export declare global {
  type ServerSideConfigProps = SSRConfig & { token: boolean }
  type GQLResponse<T> = { data: T }

  interface IContext extends YogaInitialContext {
    req: Request
    res: Response
  }

  interface IHTMLElementEvent {
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  }

  interface ILocale {
    locale: string
  }

  interface IMixMap {
    [key: string]: any
  }

  interface IStringMap {
    [key: string]: string
  }
}
