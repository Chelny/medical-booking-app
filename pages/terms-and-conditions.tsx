import type { NextPage } from 'next'
import { format, getYear } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Common } from 'constantss'

const TermsAndConditions: NextPage = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('TITLE', { ns: 'terms-and-conditions' })}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: t('CONTENT', {
            ns: 'terms-and-conditions',
            updatedDate: format(new Date(), 'PPP'),
            companyUrl: Common.REPO_URL,
            companyAddress: `${Common.REPO_URL}<br /><br />12345 Test<br /><br />Montreal, QC<br /><br />H0H 0H0<br /><br />${Common.CONTACT_EMAIL}`,
            copyrightYear: getYear(new Date()),
          }),
        }}
      />
    </>
  )
}

export const getServerSideProps = async (context: ServerSideContext) => {
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
