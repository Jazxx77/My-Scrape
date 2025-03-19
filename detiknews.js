const axios = require("axios");
const cheerio = require("cheerio");

const detiknews = async () => {
    try {
        const url = "https://news.detik.com/";
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const headlineElement = $(".media__title a").first();
        const headlineTitle = headlineElement.text().trim() || "No title found";
        const headlineLink = headlineElement.attr("href") || null;

        const beritaTerbaru = [];
        $(".list-content__item").each((_, el) => {
            const judulElement = $(el).find(".media__title a");
            const judul = judulElement.text().trim();
            const link = judulElement.attr("href");

            if (judul && link) {
                beritaTerbaru.push({ title: judul, link });
            }
        });

        const beritaLainnya = [];
        $(".media__title a").each((_, el) => {
            const judul = $(el).text().trim();
            const link = $(el).attr("href");

            if (judul && link) {
                beritaLainnya.push({ title: judul, link });
            }
        });

        return {
            headline: {
                title: headlineTitle,
                link: headlineLink
            },
            latestNews: beritaTerbaru.length > 0 ? beritaTerbaru : [],
            otherNews: beritaLainnya.length > 0 ? beritaLainnya : []
        };
    } catch (error) {
        console.error("Gagal mengambil data:", error.message);
        return { error: "Gagal mengambil data" };
    }
};


detiknews("")
