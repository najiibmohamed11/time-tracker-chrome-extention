import { icons } from './icons.ts';
import { getDomainInfo } from './timer.ts';
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



console.log('3')
export async function createTimeTrackerUI() {
  const domainInfo = getDomainInfo(window.location.href);
  const currentDomain = domainInfo.domain + '.' + domainInfo.tld;
  
  // Get the user's site preferences from Chrome storage
  try {
    const response = await chrome.storage.local.get(["addedSites", "removedSites"]);
    const { "timewise-theme": savedTheme }= await chrome.storage.local.get("timewise-theme")||'';
    const addedSites = response.addedSites || [];
    const removedSites = response.removedSites || [];
    console.log("savedTheme",savedTheme);
    
    // Check if site should be tracked
    const isInDefaultSites = defaultTimeWastingSites.includes(currentDomain);
    const isAddedByUser = addedSites.includes(currentDomain);
    const isRemovedByUser = removedSites.includes(currentDomain);
    
    const shouldTrack = (isInDefaultSites || isAddedByUser) && !isRemovedByUser;

    if (shouldTrack) {
      // Create main container
      const container = document.createElement('div');
      container.className = 'time-tracker-container';
      container.style.right = '20px';
      container.style.top = '20px';

      let isExpanded = false;

      // Create widget
      const widget = document.createElement('div');
      widget.className = 'time-tracker-widget collapsed';
      widget.style.background = savedTheme == 'dark' ? 'black' : 'white';


      // Create header
      const header = document.createElement('div');
      header.className = 'time-tracker-header';

      const headerTitle = document.createElement('div');
      headerTitle.className = 'header-title';
      headerTitle.innerHTML = `${icons.clock}`;

      const headerActions = document.createElement('div');
      headerActions.className = 'header-actions';

      const toggleButton = document.createElement('button');
      toggleButton.className = 'header-button';
      toggleButton.innerHTML = icons.minimize;
      toggleButton.onclick = () => {
        isExpanded = !isExpanded;
        widget.classList.toggle('collapsed', !isExpanded);
        toggleButton.innerHTML = isExpanded ? icons.minimize : icons.maximize;
        expandedContent.style.display = isExpanded ? 'block' : 'none';
      };

      headerActions.appendChild(toggleButton);
      header.appendChild(headerTitle);
      header.appendChild(headerActions);

      // Create content
      const content = document.createElement('div');
      content.className = 'time-tracker-content';

      const timeDisplay = document.createElement('div');
      timeDisplay.className = 'time-display';
      
      const timeValue = document.createElement('div');
      timeValue.className = 'time-value';
      timeValue.id = 'timer-display'; // For the timer functionality to update
      timeValue.style.color = savedTheme == 'dark' ? 'white' : '#1f2937';

      const timeLabel = document.createElement('div');
      timeLabel.className = 'time-label';
      timeLabel.textContent = 'Time spent on this page';


      timeDisplay.appendChild(timeValue);
      timeDisplay.appendChild(timeLabel);

      // Create expanded content
      const expandedContent = document.createElement('div');
      expandedContent.className = 'expanded-content';
      expandedContent.style.display='none'

      const actionGrid = document.createElement('div');
      actionGrid.className = 'action-grid';

      const actions = [
        { icon: icons.pieChart, label: 'Stats' },
        { icon: icons.history, label: 'History' },
        { icon: icons.settings, label: 'Settings' }
      ];

      actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-button';
        button.innerHTML = `
          <div class="action-button-icon">${action.icon}</div>
          <span class="action-button-label">${action.label}</span>
        `;
        actionGrid.appendChild(button);
      });

      expandedContent.appendChild(actionGrid);

      // Assemble the UI
      content.appendChild(timeDisplay);
      content.appendChild(expandedContent);
      widget.appendChild(header);
      widget.appendChild(content);
      container.appendChild(widget);

      // Make draggable
      let isDragging = false;
      let currentX:any;
      let currentY:any;
      let initialX:any;
      let initialY:any;
      let xOffset = 0;
      let yOffset = 0;

      header.addEventListener('mousedown', dragStart);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);

      function dragStart(e:any) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
      }

      function drag(e:any) {
        if (isDragging) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          xOffset = currentX;
          yOffset = currentY;
          container.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
      }

      function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
      }

      return container;
    } else {
      console.log("Not tracking this site:", currentDomain);
      return null;
    }
  } catch (error) {
    console.error("Error accessing Chrome storage:", error);
    return null;
  }
}