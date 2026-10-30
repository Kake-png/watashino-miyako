// Deploy ONLY to the old Worker after the new site has been verified.
export default {
  fetch(request) {
    const destination = new URL(request.url);
    destination.protocol = 'https:';
    destination.hostname = 'machierabi-annai.kake-web.workers.dev';
    destination.port = '';
    return Response.redirect(destination.href, 301);
  }
};
