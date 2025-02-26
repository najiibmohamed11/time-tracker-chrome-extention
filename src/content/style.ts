export const styles = `
  .time-tracker-container {
    position: fixed;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    user-select: none;
    z-index: 9999;
  }

  .time-tracker-widget {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 320px;
  }

  .time-tracker-widget.collapsed {
    width: 192px;
  }

  .time-tracker-header {
    background: linear-gradient(to right, #6366f1, #a855f7);
    padding: 12px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
  }

  .header-title span {
    font-weight: 500;
    color: white;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.2s;
  }

  .header-button:hover {
    color: white;
  }

  .time-tracker-content {
    padding: 16px;
  }

  .time-display {
    text-align: center;
  }

  .time-value {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .time-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .expanded-content {
    margin-top: 16px;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 12px;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: #f9fafb;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .action-button:hover {
    background: #f3f4f6;
  }

  .action-button-icon {
    color: #6366f1;
    margin-bottom: 4px;
  }

  .action-button-label {
    font-size: 0.75rem;
    color: #4b5563;
  }
`;