export default {
  /**
   * @param {Request} request
   * @returns {Response}
   */
  async fetch({ url, method, headers }) {
    if (method == "OPTIONS")
      return new Response("", {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    if (method == "GET") {
      if (headers.get("origin") == "https://rewatch.to")
        return new Response("Blocked", { status: 403 });
      const locationSpecified = new URL(url).searchParams.get("url");
      if (!locationSpecified)
        return new Response("No url to get specified", { status: 400 });
      const locationResponse = await fetch(locationSpecified, {
        headers: { "User-Agent": "github.com/SkyblockClient (mart, proxy)" },
      });
      const response = new Response(locationResponse.body, {
        status: locationResponse.status,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      return response;
    }
    return new Response(`Method ${method} is not supported`, { status: 405 });
  },
};
