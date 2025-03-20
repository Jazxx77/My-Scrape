const axios = require("axios");
const cheerio = require("cheerio");

function encodeUrl(url) {
    return encodeURIComponent(url);
}

async function ypsearch(query) {
    try {
        const url = `https://www.youporn.com/search/?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
            },
        });

        const $ = cheerio.load(data);
        const results = [];

        $(".video-box").each((i, el) => {
            const title = $(el).find(".video-title").text().trim() || "No title found";
            const videoPath = $(el).find("a").attr("href");
            const url = videoPath ? `https://www.youporn.com${videoPath}` : "No URL";
            const thumbnail = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "No thumbnail";
            const duration = $(el).find(".video-duration").text().trim() || "No duration";

            results.push({ title, url, thumbnail, duration });
        });

        console.log(results.length > 0 ? results : "No results found");
        return results.length > 0 ? results : [];
    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }
}

async function ypdown(videoUrl) {
    try {
        const apiUrl = "https://api.v02.savethevideo.com/tasks";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
            "Referer": `https://www.savethevideo.com/de/home?url=${encodeUrl(videoUrl)}`
        };

        const data = { type: "info", url: videoUrl };
        const response = await axios.post(apiUrl, data, { headers });

        if (response.data && response.data.result && response.data.result.length > 0) {
            const videoData = response.data.result[0]; 
            const videoFormats = videoData.formats.map(f => ({
                format: f.format,
                url: f.url
            }));

            return {
                title: videoData.title,
                uploader: videoData.uploader,
                upload_date: videoData.upload_date,
                views: videoData.view_count,
                duration: videoData.duration_string,
                thumbnail: videoData.thumbnail,
                available_formats: videoFormats
            };
        }
        return { error: "Video tidak ditemukan." };
    } catch (error) {
        return { error: error.message };
    }
}

// Contoh penggunaan ypsearch
return ypsearch("jordi")
// Contoh penggunaan ypdown
return ypdown("https://www.youporn.com/watch/102951071/'")
