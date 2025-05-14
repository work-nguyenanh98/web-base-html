export async function onRequest(context) {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  
    const pages = [
      { url: "https://out-and-about-burgers.site/", changefreq: "weekly", priority: "1.0" },
      { url: "https://out-and-about-burgers.site/about", changefreq: "monthly", priority: "0.8" },
      { url: "https://out-and-about-burgers.site/menu", changefreq: "weekly", priority: "0.9" },
      { url: "https://out-and-about-burgers.site/photos", changefreq: "monthly", priority: "0.7" },
      { url: "https://out-and-about-burgers.site/services", changefreq: "monthly", priority: "0.7" },
      { url: "https://out-and-about-burgers.site/contact", changefreq: "monthly", priority: "0.8" },
    ];
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`).join("")}
  </urlset>`;
  
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
  