export const download = async (url: string) => {
  return await fetch(
    "https://mart-proxy.ktibow.workers.dev/?url=" + encodeURIComponent(url)
  );
};
