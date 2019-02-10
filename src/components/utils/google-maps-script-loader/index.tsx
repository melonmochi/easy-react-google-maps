declare global {
  interface Window {
    google: typeof google;
  }
}

export const googleMapsScriptLoader = (url: string) => {
  const googleURL = url;

  return new Promise<typeof google>((resolve, reject) => {
    const target = document.createElement('script');
    target.async = true;
    target.type = 'text/javascript';
    target.src = googleURL;
    const head = document.getElementsByTagName('head')[0];
    head.insertBefore(target, head.lastChild);
    target.onload = () => {
      resolve(window.google);
    };
    target.onerror = () => {
      reject(new Error('Could not load Google Maps API'));
    };
  });
};
