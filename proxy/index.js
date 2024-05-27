export default {
  /**
   * @param {Request} request
   * @returns {Response}
   */
  async fetch({ url: urlStr, method, headers }) {
    if (headers.get("origin") == "https://rewatch.to")
      return new Response("Blocked", { status: 403 });
    const url = new URL(urlStr);
    if (url.pathname != "/")
      return new Response("Not found", { status: 404 });
    switch (method) {
      case "OPTIONS":
        return new Response("", {
          headers: { "access-control-allow-origin": "*" }
        });
      case "GET":
        const locationSpecified = url.searchParams.get("url");
        if (!locationSpecified)
          return new Response("No url to get specified", { status: 400 });
        const qHeaders = {
          "user-agent": "github.com/SkyblockClient (mart, proxy)"
        };
        const qEtag = headers.get("If-None-Match");
        if (qEtag)
          qHeaders["if-none-match"] = qEtag;
        const locationResponse = await fetch(locationSpecified, {
          headers: qHeaders
        });
        if (locationResponse.status == 304)
          return new Response("", { status: 304 });
        const aHeaders = {
          "access-control-allow-origin": "*"
        };
        const aEtag = locationResponse.headers.get("etag");
        if (aEtag)
          aHeaders["etag"] = aEtag;
        const response = new Response(locationResponse.body, {
          status: locationResponse.status,
          headers: aHeaders
        });
        return response;
      default:
        return new Response(`Method ${method} is not supported`, {
          status: 405
        });
    }
  }
};
