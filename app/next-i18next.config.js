module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'uk'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
