# Portfolio

## Deploy de produção

O build de produção gera uma aplicação Angular prerenderizada. Publique somente o conteúdo de:

```text
dist/portfolio/browser
```

Para configurar o domínio público, execute no PowerShell, substituindo pelo domínio real:

```powershell
$env:SITE_URL="https://seu-dominio.com"
npm run seo:generate
npm run build
```

O comando `seo:generate` atualiza a única configuração pública de URL e gera `sitemap.xml` e `robots.txt`. O build seguinte usa o mesmo valor para canonical, `og:url` e JSON-LD.

As rotas públicas abaixo são prerenderizadas e podem ser acessadas diretamente:

```text
/
/projetos
/projetos/item-rarity
/projetos/baito-barbearia
/projetos/clinic-management
```

Em hospedagem Apache/Hostinger, não é necessário `.htaccess` para essas rotas prerenderizadas: cada diretório contém seu próprio `index.html`. Para rotas Angular futuras que não forem prerenderizadas, configurar fallback no painel da hospedagem somente após validar o comportamento do 404.

Assets hashados podem receber cache longo. HTML deve usar cache curto ou revalidação para permitir novos deploys.

Não é necessário gerar gzip ou Brotli manualmente se a hospedagem já fornecer compressão HTTP.

Headers recomendados no servidor: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e uma `Permissions-Policy` restritiva. CSP deve ser adicionada separadamente após teste específico da Intro e do SSR.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
