import React, { useEffect, useState } from 'react';

/**
 * Componente de diagnóstico. Use em uma rota temporária.
 * O vídeo precisa ser público e permitir incorporação.
 */
export default function YouTubeTest({ videoId = 'yc9moz7aNOY' }) {
  const [status, setStatus] = useState('Carregando player…');

  useEffect(() => {
    let disposed = false;
    let player;

    const init = () => {
      if (disposed || !window.YT?.Player) return;
      player = new window.YT.Player('trezio-youtube-test-player', {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          rel: 0,
        },
        events: {
          onReady: () => !disposed && setStatus('Player pronto.'),
          onStateChange: (event) => {
            if (!disposed) setStatus(`Estado do player: ${event.data}`);
          },
          onError: (event) => {
            if (!disposed) setStatus(`Erro do YouTube: ${event.data}`);
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const existing = document.querySelector('script[data-youtube-iframe-api]');
      const script = existing || document.createElement('script');
      if (!existing) {
        script.src = 'https://www.youtube.com/iframe_api';
        script.dataset.youtubeIframeApi = 'true';
        document.head.appendChild(script);
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        init();
      };
    }

    return () => {
      disposed = true;
      if (player?.destroy) player.destroy();
    };
  }, [videoId]);

  return (
    <section style={{ width: '100%', height: '100vh', background: '#000', color: '#fff' }}>
      <div id="trezio-youtube-test-player" style={{ width: '100%', height: 'calc(100% - 48px)' }} />
      <div role="status" style={{ padding: 12 }}>{status}</div>
    </section>
  );
}
