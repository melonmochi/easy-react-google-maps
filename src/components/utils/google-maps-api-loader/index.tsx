import { googleMapsURLStringify, googleMapsScriptLoader } from 'utils';
import { config } from 'config';
import { GoogleMapsLoaderInputProps } from 'typings';

export const googleMapsApiLoader = async (loaderInput: GoogleMapsLoaderInputProps) => {
  if(window.google) {
    return window.google
  }
  const googleApiKey = loaderInput.apiKey? loaderInput.apiKey: config.apiKey
  const { language, region } = loaderInput
  const googleApiProps = Object.assign({}, loaderInput, {
    apiKey: googleApiKey,
    language,
    region,
  });
  const googleMapsURL = googleMapsURLStringify(googleApiProps);
  const gmApi = await googleMapsScriptLoader(googleMapsURL)
  return gmApi
}
