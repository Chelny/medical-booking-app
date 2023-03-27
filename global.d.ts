import { Request, Response } from 'express'
import { GraphQLError } from 'graphql'
import { YogaInitialContext } from 'graphql-yoga'

export declare global {
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

  interface IStringMap {
    [key: string]: string
  }

  type GQLResponse<T> = { data: T | null; errors?: GraphQLError[] }

  type ServerSideContext = IContext & ILocale
}
