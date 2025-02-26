import { styles } from './style.ts';
import { createTimeTrackerUI } from './ui.ts';
import { initTimer, startTimer } from './timer.ts';

async function initializeContent() {
  // Create and inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  try {
    // Wait for the UI container to be created
    const container = await createTimeTrackerUI();
    
    if (container) {
      // First append the container to the document
      document.body.appendChild(container);
      
      // Now that the element exists in the DOM, we can safely initialize the timer
      const timerDisplay = container.querySelector('#timer-display');
      if (timerDisplay) {
        initTimer(timerDisplay);
        startTimer();
      }
    }
  } catch (error) {
    console.error('Error initializing content:', error);
  }
}

initializeContent();