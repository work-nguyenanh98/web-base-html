export async function onRequest({ request, env }) {
  const response = await env.ASSETS.fetch(request);
  const html = await response.text();

  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${year}`;

  const titleRegex = /<title>(.*?)<\/title>/;
  const match = html.match(titleRegex);

  if (match) {
    const currentTitle = match[1];
    const updatedTitle = `${currentTitle} - Full Update ${formattedDate}`;
    const modifiedHtml = html.replace(titleRegex, `<title>${updatedTitle}</title>`);
    return new Response(modifiedHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
