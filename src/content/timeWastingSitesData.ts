
export const defaultTimeWastingSites = [
  // Social Media
  "facebook.com",
  "instagram.com",
  "x.com", // Twitter's new domain
  "tiktok.com",
  "reddit.com",
  "pinterest.com",
  "snapchat.com",
  "tumblr.com",
  "discord.com",
  "twitch.tv",
  "vk.com",
  "weibo.com",
  "threads.net",
  "localhost:5173",

  // Video Streaming & Entertainment
  "youtube.com",
  "netflix.com",
  "disneyplus.com",
  "hulu.com",
  "amazon.com/primevideo",
  "hbomax.com",
  "crunchyroll.com",
  "pornhub.com",
  "xvideos.com",
  "dailymotion.com",
  "vimeo.com",

  // Gaming
  "steampowered.com",
  "epicgames.com",
  "roblox.com",
  "minecraft.net",
  "fortnite.com",
  "leagueoflegends.com",
  "chess.com",
  "miniclip.com",
  "crazygames.com",
  "newgrounds.com",

  // Shopping & Deals
  "amazon.com",
  "ebay.com",
  "aliexpress.com",
  "etsy.com",
  "walmart.com",
  "bestbuy.com",
  "target.com",
  "shein.com",
  "zalando.com",
  "temu.com",
  "groupon.com",

  // News & Gossip
  "buzzfeed.com",
  "tmz.com",
  "dailymail.co.uk",
  "9gag.com",
  "boredpanda.com",
  "ladbible.com",
  "vice.com",
  "thesun.co.uk",
  "perezhilton.com",

  // Forums & Random Content
  "4chan.org",
  "imgur.com",
  "gaiaonline.com",
  "deviantart.com",
  "wattpad.com",
  "fanfiction.net",

  // Memes & Casual Browsing
  "knowyourmeme.com",
  "cheezburger.com",
  "giphy.com",
  "imgflip.com",
  "theonion.com",
  "thechive.com",

  // Gambling & Adult Content
  "stake.com",
  "draftkings.com",
  "bet365.com",
  "onlyfans.com",
  "chaturbate.com",
  "stripchat.com",
  "myfreecams.com",

  // Miscellaneous
  "omegle.com",
  "chatroulette.com",
  "monkey.cool",
  "aol.com/games",
  "candycrush.com",
  "cookieclicker.com",
  "coolmathgames.com",
];

export async function getTimeWastingSites() {
  // Get user modifications (or default to an empty array)
  const response = await chrome.storage.local.get(["addedSites", "removedSites"]);
  const addedSites = response.addedSites || [];
  const removedSites = response.removedSites || [];

  // Combine the added sites with the default list…
  const combined = [...addedSites, ...defaultTimeWastingSites];

  // …and remove any sites the user has removed.
  return combined.filter(site => !removedSites.includes(site));
}


