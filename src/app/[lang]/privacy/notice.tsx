import type { ReactNode } from 'react';

import type { Locale } from '@/i18n/config';

/** Last change to the notice, `YYYY-MM`: update it with any change to the texts below */
export const NOTICE_UPDATED = '2026-10';

const GOOGLE_PARTNER_SITES = 'https://policies.google.com/technologies/partner-sites';
const GA_OPT_OUT = 'https://tools.google.com/dlpage/gaoptout';

interface Notice {
  title: string;
  description: string;
  updated: string;
  home: string;
  sections: { heading: string; body: ReactNode }[];
}

/**
 * Privacy notice: what Ley 1581 de 2012 (Decreto 1377 de 2013, art. 15) asks of a
 * data controller and what the Google Analytics terms (section 7) ask of a site using it.
 * Lives here instead of the dictionaries: the lazy skins load those and never show this.
 */
export const getNotice = (lang: Locale, email: ReactNode): Notice =>
  ({
    en: {
      title: 'Privacy',
      description: 'What this site measures, why, and how to exercise your rights.',
      updated: 'Last updated',
      home: 'Back to the home page',
      sections: [
        {
          heading: 'Who is responsible',
          body: <>Santiago Betancur Duque, an individual based in Medellín, Colombia: {email}.</>
        },
        {
          heading: 'What is collected and why',
          body: (
            <>
              This site uses Google Analytics 4, which sets cookies (<code>_ga</code>,{' '}
              <code>_ga_*</code>) to measure visits statistically: pages viewed, traffic source,
              device and browser, approximate location and interactions with the page. Google
              Analytics does not log or store IP addresses, and the site asks for no personal
              information. The only purpose is to learn how the portfolio is used and improve it.
            </>
          )
        },
        {
          heading: 'Who processes it and for how long',
          body: (
            <>
              Google LLC processes the data on my behalf, on servers that may be in the United
              States or other countries. It is kept for 14 months.{' '}
              <a href={GOOGLE_PARTNER_SITES}>
                How Google uses information from sites or apps that use its services
              </a>
              .
            </>
          )
        },
        {
          heading: 'Your rights',
          body: (
            <>
              You can access, update, correct or delete your data and withdraw your authorization by
              writing to {email}: queries are answered within 10 business days and claims within 15.
              You can also complain to Colombia&apos;s Superintendencia de Industria y Comercio or,
              in the European Union, to your data protection authority. To stop being measured,
              block or delete cookies in your browser or install the{' '}
              <a href={GA_OPT_OUT}>Google Analytics opt-out browser add-on</a>.
            </>
          )
        }
      ]
    },
    es: {
      title: 'Privacidad',
      description: 'Qué mide este sitio, para qué y cómo ejercer tus derechos.',
      updated: 'Última actualización',
      home: 'Volver al inicio',
      sections: [
        {
          heading: 'Responsable',
          body: (
            <>
              Santiago Betancur Duque, persona natural con domicilio en Medellín, Colombia: {email}.
            </>
          )
        },
        {
          heading: 'Qué datos se recogen y para qué',
          body: (
            <>
              Este sitio usa Google Analytics 4, que instala cookies (<code>_ga</code>,{' '}
              <code>_ga_*</code>) para medir las visitas de forma estadística: páginas vistas,
              origen del tráfico, dispositivo y navegador, ubicación aproximada e interacciones con
              la página. Google Analytics no registra ni almacena direcciones IP, y el sitio no pide
              datos personales. La única finalidad es saber cómo se usa el portafolio para
              mejorarlo.
            </>
          )
        },
        {
          heading: 'Quién los trata y por cuánto tiempo',
          body: (
            <>
              Google LLC los trata por cuenta mía, en servidores que pueden estar en Estados Unidos
              u otros países. Se conservan durante 14 meses.{' '}
              <a href={`${GOOGLE_PARTNER_SITES}?hl=es`} hrefLang='es'>
                Cómo usa Google la información de sitios o aplicaciones que utilizan sus servicios
              </a>
              .
            </>
          )
        },
        {
          heading: 'Tus derechos',
          body: (
            <>
              Puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la
              autorización, escribiendo a {email}: las consultas se responden en máximo 10 días
              hábiles y los reclamos en 15 (Ley 1581 de 2012). También puedes acudir a la
              Superintendencia de Industria y Comercio o, en la Unión Europea, a tu autoridad de
              protección de datos. Para no ser medido, bloquea o borra las cookies en tu navegador o
              instala el{' '}
              <a href={`${GA_OPT_OUT}?hl=es`} hrefLang='es'>
                complemento de inhabilitación de Google Analytics
              </a>
              .
            </>
          )
        }
      ]
    }
  })[lang];
