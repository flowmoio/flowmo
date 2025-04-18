import { useEffect } from 'react';
import { useActions, useStatus } from './useTimer';

export default function useTick() {
  const status = useStatus();
  const { tick } = useActions();

  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== 'running') {
        return;
      }

      tick(() => {
        const audio = new Audio('/alarm.mp3');
        audio.play();

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Flowmo', {
            body: 'Time to get back to work!',
            icon: '/images/icons/general_icon_x512.png',
          });
        }
      });
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, tick]);
}
