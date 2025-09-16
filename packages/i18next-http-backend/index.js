const DEFAULT_OPTIONS = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: undefined,
  addMethod: 'POST',
  parse(data) {
    return JSON.parse(data);
  },
  requestOptions: {},
  fetch: undefined,
  customPayload: undefined,
};

const hasFetch = () => {
  if (typeof fetch === 'function') {
    return fetch.bind(globalThis);
  }

  return null;
};

class HttpBackend {
  constructor(services, options = {}, i18nextOptions = {}) {
    this.init(services, options, i18nextOptions);
  }

  init(services, options = {}, i18nextOptions = {}) {
    this.services = services;
    this.i18nextOptions = i18nextOptions;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    if (typeof this.options.parse !== 'function') {
      this.options.parse = DEFAULT_OPTIONS.parse;
    }

    if (!this.options.requestOptions) {
      this.options.requestOptions = {};
    }
  }

  read(language, namespace, callback) {
    const loadPath = this._resolvePath(this.options.loadPath, language, namespace);
    const fetchApi = this.options.fetch || hasFetch();

    if (!fetchApi) {
      callback(new Error('No fetch implementation available for i18next-http-backend'), false);
      return;
    }

    const requestOptions = { ...this.options.requestOptions };

    fetchApi(loadPath, requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          const error = new Error(`Failed loading translations for ${language}/${namespace}: ${response.status} ${response.statusText}`);
          error.status = response.status;
          throw error;
        }

        const text = await response.text();

        try {
          const parsed = this.options.parse(text, language, namespace);
          callback(null, parsed);
        } catch (error) {
          callback(error, false);
        }
      })
      .catch((error) => {
        callback(error, false);
      });
  }

  readMulti(languages, namespaces, callback) {
    const results = {};
    const promises = [];

    languages.forEach((lang) => {
      namespaces.forEach((ns) => {
        promises.push(
          new Promise((resolve, reject) => {
            this.read(lang, ns, (error, data) => {
              if (error) {
                reject(error);
                return;
              }

              if (!results[lang]) {
                results[lang] = {};
              }

              results[lang][ns] = data;
              resolve();
            });
          }),
        );
      });
    });

    if (!promises.length) {
      callback(null, results);
      return;
    }

    Promise.all(promises)
      .then(() => callback(null, results))
      .catch((error) => callback(error, false));
  }

  create(languages, namespace, key, fallbackValue) {
    if (!this.options.addPath) {
      return;
    }

    const fetchApi = this.options.fetch || hasFetch();

    if (!fetchApi) {
      return;
    }

    const addPath = this._resolvePath(this.options.addPath, languages[0], namespace);
    const payload = typeof this.options.customPayload === 'function'
      ? this.options.customPayload(languages, namespace, key, fallbackValue)
      : { [key]: fallbackValue ?? '' };

    const baseRequestOptions = this.options.requestOptions || {};
    const headers = {
      'Content-Type': 'application/json',
      ...(baseRequestOptions.headers || {}),
    };

    const requestOptions = {
      ...baseRequestOptions,
      method: this.options.addMethod || 'POST',
      headers,
      body: JSON.stringify(payload),
    };

    fetchApi(addPath, requestOptions).catch(() => {
      // Swallow network errors when attempting to save missing keys.
    });
  }

  _resolvePath(template, language, namespace) {
    return template
      .replace('{{lng}}', language)
      .replace('{{language}}', language)
      .replace('{{ns}}', namespace);
  }
}

HttpBackend.type = 'backend';

export default HttpBackend;
export { HttpBackend };
