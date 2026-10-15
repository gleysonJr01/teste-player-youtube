## Integrar ao NestJS

1. Copie `web/youtube-test.html` para `public/youtube-test.html` na raiz do projeto NestJS.
2. Registre `YouTubeTestController` em um módulo existente ou em um módulo de diagnóstico.
3. Confirme que seu proxy HTTPS/Traefik encaminha `/youtube-test` para o NestJS.
4. Acesse `https://SEU-DOMINIO/youtube-test` na TV.

Este controller só serve a página de teste; não intercepta tráfego do YouTube e não remove cabeçalhos de identidade.
