export const randomCode = (alias = ''): string =>
  alias + (Date.now() * Math.random()).toString();
