
// Timer functionality
let startTime = Date.now();//melliseconda
let elapsedTime = 0;
let timerInterval:any = null;
let isTabActive = true;
let timerDisplay:any = null; // Add reference to timerDisplay

export function getDomainInfo(url:string) {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;
    
    // Split the hostname into parts
    const parts = hostname.split('.');
    
    // Extract domain information
    const info = {
        subdomain: parts.length > 2 ? parts.slice(0, -2).join('.') : '',
        domain: parts.length > 1 ? parts[parts.length - 2] : '',
        tld: parts[parts.length - 1]
    };    
    return info;
}


// Initialize timer with display element
export function initTimer(displayElement:any) {
    timerDisplay = displayElement;
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);// /1000 in order to go up and get seconds 
    const hours = Math.floor(elapsedTime / 3600);//we ganna devide 3600 in order to go up and get hour 
    const minutes = Math.floor((elapsedTime % 3600) / 60);//
    const seconds = elapsedTime % 60;
    
    if (timerDisplay) {
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Add these utility functions at the top of your timer.js
function getStorageKey() {
    const domain = getDomainInfo(window.location.href).domain;
    return `pageTimer_${domain}`;
}

function saveToStorage(time:number) {
    try {
        localStorage.setItem(getStorageKey(), time.toString());
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem(getStorageKey());
        return saved ? parseInt(saved) : 0;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return 0;
    }
}

// Modify your startTimer function
export function startTimer() {
    timerDisplay = document.querySelector('#timer-display');
    if (!timerDisplay) {
        console.log('Timer display element not initialized');
        return;
    }
    if (!timerInterval) {
        // Load saved time from storage
        elapsedTime = loadFromStorage();
        startTime = Date.now() - (elapsedTime * 1000);
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Modify your pauseTimer function
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        // Save when timer is paused
        saveToStorage(elapsedTime);
    }
}

// Add event listeners for important events
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseTimer();
    } else {
        startTimer();
    }
});

// Handle tab focus/blur
window.addEventListener('focus', () => {
    isTabActive = true;
    startTimer();
});

window.addEventListener('blur', () => {
    isTabActive = false;
    pauseTimer();
});

// Optional: Save periodically (every minute instead of every second)
setInterval(() => {
    if (timerInterval) {
        saveToStorage(elapsedTime);
    }
}, 60000); // Save every minute


