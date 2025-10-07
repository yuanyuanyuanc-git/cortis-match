import { supabase } from './supabaseClient';

// Analytics utility to track game events
export const trackEvent = async (eventName, eventData = {}) => {
  try {
    const { error } = await supabase
      .from('game_events')
      .insert({
        event_name: eventName,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight
      });

    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (err) {
    console.error('Failed to track event:', err);
  }
};

// Specific event tracking functions
export const analytics = {
  // Track page view
  pageView: () => {
    trackEvent('page_view');
  },

  // Track level start
  levelStart: (level) => {
    trackEvent('level_start', { level });
  },

  // Track level complete
  levelComplete: (level) => {
    trackEvent('level_complete', { level });
  },

  // Track level fail
  levelFail: (level) => {
    trackEvent('level_fail', { level });
  },

  // Track share click
  shareClick: (platform, context) => {
    trackEvent('share_click', { platform, context });
  },

  // Track music toggle
  musicToggle: (isPlaying) => {
    trackEvent('music_toggle', { is_playing: isPlaying });
  }
};
