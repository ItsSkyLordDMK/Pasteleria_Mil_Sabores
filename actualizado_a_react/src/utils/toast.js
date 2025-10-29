// Simple toast event emitter
export function showToast(type = 'info', message = '', opts = {}) {
  try {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { type, message, opts } }));
  } catch (e) {
    // fallback to alert if dispatch fails
    try { alert(message); } catch(_) {}
  }
}

export default showToast;
