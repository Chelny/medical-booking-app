import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Common } from 'constants/common'
import { getAuthCookie } from 'utils/auth-cookies'

const TermsAndConditions: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('TITLE', { ns: 'terms-and-conditions' })}</h2>
      {/* TODO: Complete and figure out why the page is unaccessible */}
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero nobis doloribus quidem? Libero voluptas totam
        culpa qui est officia, illo labore obcaecati deleniti fugit id impedit aliquam illum voluptatibus reprehenderit?
      </p>
    </>
  )
}

export const getServerSideProps = async (context: IContext & ILocale) => {
  const token = getAuthCookie(context.req) || null

  if (!token) return Common.SERVER_SIDE_PROPS.NO_TOKEN

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        ...Common.SERVER_SIDE_PROPS.TRANSLATION_NAMESPACES,
        'terms-and-conditions',
      ])),
    },
  }
}

export default TermsAndConditions
