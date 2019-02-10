import { GoogleMapsLoaderInputProps } from 'typings'

export const googleMapsURLStringify = (loaderInput: GoogleMapsLoaderInputProps) => {
  if (
    !loaderInput.apiKey && loaderInput.clientID
  ) {
    throw new Error('You must pass an apiKey or an clientID to use GoogleApi');
  }

  const {
    apiKey,
    callback = null,
    channel = null,
    clientID,
    language = 'en',
    libraries = ['places'],
    region = 'US',
    url = 'https://maps.googleapis.com/maps/api/js',
    version = '3.35',
  } = loaderInput;

  const urlStringify = () => {
    const params = {
      callback,
      channel,
      client: clientID,
      key: apiKey,
      language,
      libraries: libraries.join(','),
      region,
      v: version,
    };

    const paramsKeys = Object.keys(params);

    const paramStr = paramsKeys
      .filter(k => (params as any)[k])
      .map(k => `${k}=${(params as any)[k]}`)
      .join('&');
    return `${url}?${paramStr}`;
  };
  return urlStringify();
};
