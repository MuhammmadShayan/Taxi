'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// Simple beep sound as base64
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'; // Shortened placeholder, will use a real one or just standard beep logic if possible, but browsers block auto-play often.
// Let's use a slightly better base64 for a pleasant "ding" if possible, or just a standard approach.
// Actually, for simplicity and reliability, I'll use a simple Audio object with a standard sound URL if available, 
// or a generated beep. Since I can't easily upload a file, I'll use a silent failure or a very short base64 string.
// For this environment, I'll try to use a reliable short beep base64.
const BEEP_SOUND = 'data:audio/mp3;base64,//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'; // Empty/invalid.

// Using a known short beep base64
const NOTIFICATION_AUDIO = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'; // This is likely too short/invalid.

// Let's assume for now we just track the state and if a sound file existed we'd play it.
// I will add a method that tries to play a sound, but won't crash if it fails.

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [volume, setVolume] = useState(0.5); // 0 to 1
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const pollDisabledUntilRef = useRef(0);
  const isPollingRef = useRef(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Load volume/sound settings from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('notification_volume');
    const savedSoundEnabled = localStorage.getItem('notification_sound_enabled');
    
    if (savedVolume !== null) setVolume(parseFloat(savedVolume));
    if (savedSoundEnabled !== null) setIsSoundEnabled(savedSoundEnabled === 'true');
  }, []);

  // Persist settings
  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    localStorage.setItem('notification_volume', newVolume);
  };

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem('notification_sound_enabled', newState);
  };

  const playNotificationSound = useCallback(() => {
    if (!isSoundEnabled || volume === 0) return;

    try {
      // Create a simple oscillator beep since we don't have a file
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 500; // Hz
        gain.gain.value = volume * 0.1; // Scale down a bit as oscillators are loud

        osc.start();
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, 200); // 200ms beep
      }
    } catch (e) {
      console.error('Failed to play notification sound', e);
    }
  }, [isSoundEnabled, volume]);

  const requestNotificationPermission = useCallback(() => {
    try {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          setNotificationPermission(perm);
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if ('Notification' in window) setNotificationPermission(Notification.permission);
    } catch {}
  }, []);

  const showNotification = useCallback((title, body) => {
    try {
      if (!('Notification' in window)) return;
      if (notificationPermission !== 'granted') return;
      new Notification(title, { body });
    } catch {}
  }, [notificationPermission]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    const now = Date.now();
    if (pollDisabledUntilRef.current && now < pollDisabledUntilRef.current) return;
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch('/api/chat/unread-count', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        // If count increased, play sound
        setUnreadCount(prev => {
          if (data.unreadCount > prev) {
             // Check if it is not the initial load (count 0) to avoid noise on refresh
             // But since we initialize to 0, the first fetch will likely be > 0.
             // We can use a simple heuristic: if prev is 0, maybe don't play, 
             // UNLESS we want to notify on login. 
             // Let's rely on the user setting. If they have sound enabled, they probably want to know.
             // But typically, on page load, you don't want a beep.
             // We can use a flag outside state or a ref.
             if (prev > 0 || (prev === 0 && data.unreadCount > 0 && window.performance && window.performance.now() > 5000)) {
                // Play sound if not immediately on load (assuming load takes < 5s)
              playNotificationSound();
              showNotification('New messages', `${data.unreadCount - prev} new message(s)`);
           }
          }
          return data.unreadCount;
        });
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Backoff on server-side connection pressure
      const now = Date.now();
      if (!fetchUnreadCount.errorCountRef) fetchUnreadCount.errorCountRef = { c: 0 };
      fetchUnreadCount.errorCountRef.c++;
      const backoff = fetchUnreadCount.errorCountRef.c >= 3 ? 10 * 60 * 1000 : 2 * 60 * 1000; // 10m after 3 errors
      pollDisabledUntilRef.current = now + backoff;
    }
    isPollingRef.current = false;
  }, [user, playNotificationSound]);

  // Poll for unread count
  useEffect(() => {
    if (!user) {
        setUnreadCount(0);
        return;
    }

    fetchUnreadCount(); // Initial fetch

    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s when visible/no backoff
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      fetchUnreadCount,
      playNotificationSound,
      showNotification,
      requestNotificationPermission,
      volume,
      setVolume: updateVolume,
      isSoundEnabled,
      toggleSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
