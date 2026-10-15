# Trezioplay — teste YouTube/Tizen 5.5

Este pacote separa três experimentos:
1. **WGT local**: app empacotado com `index.html`.
2. **Hosted App (diagnóstico)**: inicia em uma página HTTPS própria.
3. **Proxy reverso de recursos próprios**: Node/NestJS pode encaminhar páginas/recursos do seu próprio domínio. Não intercepta nem remove cabeçalhos das chamadas do YouTube.

## Importante sobre o erro 153

O erro 153 significa que o player não recebeu `HTTP Referer` ou identificação equivalente. A documentação do YouTube exige identificação para players incorporados. Por isso este projeto **não remove `Referer`/`Origin` para contornar o bloqueio**. O HTML de teste define uma política de referência explícita e registra os eventos do player.

Hosted Apps Samsung exigem autorização/contato prévio com o Content Manager e não suportam Tizen APIs. Use apenas como teste de diagnóstico, não presuma que será aceito comercialmente.

## 1. Teste HTTPS primeiro

Requer Node.js 18+.

```bash
cd node-proxy
npm install
cp .env.example .env
# Edite APP_UPSTREAM para a URL do seu site de teste, se for usar o encaminhamento.
npm start
```

Por padrão, o servidor entrega a página de teste em `http://localhost:3000/youtube-test`.
Para testar na TV, publique este servidor atrás de HTTPS em um domínio seu. Não exponha o servidor de desenvolvimento diretamente à internet.

Rotas:
- `GET /health` — health check.
- `GET /youtube-test` — página de teste do iframe.
- `GET /app/*` — encaminha apenas para o `APP_UPSTREAM` configurado (recursos do seu próprio site).

O proxy de `/app/*` não é um proxy para YouTube.

## 2. Teste no navegador da TV

Abra `https://SEU-DOMINIO/youtube-test`. Se funcionar no navegador da TV, compare com o WGT local.

## 3. Hosted App

Veja `tizen/hosted/config.xml.example`. Substitua:
- `SEU_PACKAGE_ID` por um ID de pacote válido de 10 caracteres;
- `SEU_PACKAGE_ID.TestHosted` pelo ID completo do app;
- URL e ícone conforme o projeto.

A documentação Tizen usa `<tizen:content src="https://..."/>` para indicar uma página inicial hospedada. Não substitua o `config.xml` da aplicação de produção sem criar um projeto de teste separado.

## 4. WGT local

Veja `tizen/local/config.xml.example`. Esse exemplo mantém `<content src="index.html"/>`. Copie `web/youtube-test.html` como `index.html` no projeto de teste local.

## 5. React

`react/YouTubeTest.jsx` é um componente isolado. Use-o em uma rota de diagnóstico; não é necessário criar uma página por vídeo. Passe o ID do vídeo via prop.

## 6. NestJS (alternativa)

O exemplo `nestjs/youtube-test.controller.ts` serve uma página de teste estática do próprio servidor. Ele não intercepta chamadas do YouTube. Copie o HTML para `public/youtube-test.html` e configure `ServeStaticModule` conforme o README do NestJS, ou adapte para seu módulo estático existente.

## Limitações

- Um iframe pode falhar por restrição de incorporação do vídeo, região/conta, codecs, rede ou política do dispositivo.
- Um proxy reverso genérico não resolve automaticamente o erro 153; o requisito é fornecer identificação do cliente conforme as regras do YouTube.
- Antes de distribuir comercialmente, valide as políticas da Samsung Seller Office e do YouTube.
# teste-player-youtube
