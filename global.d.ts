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

  type GenericObject = Record<string, unknown>

  type GQLResponse<T> = { data: T | null; errors?: GraphQLError[] }

  type ServerSideContext = IContext & ILocale

  type StepProgressBarInfo = { translation: { key: string; namespace?: string }; iconName: IconProp }
}
