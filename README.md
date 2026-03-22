# Perheen laskeutumissivu

Tässä repossa on perheen kotisivun staattinen HTML-sivu ja kuva-arkisto.

## Tiedostot

- `index.html` - koko sivu html + Tailwind CSS (CDN)
- `kuvat/` - galleria- ja hero-kuvat, JPG-muodossa
- `members/` - perheenjäsenten kuvat, JPG-muodossa

## Asennus ja käyttö

1. Varmista, että `index.html` and `kuvat/` ja `members/` ovat samassa hakemistossa.
2. Avaa `index.html` selaimella (kaksoisklikkaus tai selaimen "Open File").

## GitHub Pages (julkaisu)

1. Luo uusi repositorio GitHubiin.
2. Lisää toiminnan ohjeet:
   
```bash
git init
git add .
git commit -m "Add family landing page"
git branch -M main
git remote add origin https://github.com/<kayttaja>/<repo>.git
git push -u origin main
```

3. Mene GitHub-repon Settings -> Pages -> valitse `main` branch ja `/ (root)`.
4. Sivusi on käytettävissä osoitteessa `https://<kayttaja>.github.io/<repo>/`.

## Vercel Backend (Kalenteri)

Kalenteri käyttää Vercel Functions ja KV-tallennusta jaetulle kalenterille. Aseta seuraavasti:

1. Asenna Vercel CLI: `npm install -g vercel`
2. Kirjaudu: `vercel login`
3. Linkitä projekti: `vercel link` (valitse GitHub-repo)
4. Ota KV käyttöön: `vercel kv enable`
5. Deploy: `vercel --prod`
6. Sivusi on käytettävissä Vercel-URL:ssä.

### Kirjautuminen
- Käyttäjänimet: Emilia, Tuomas, Mauno, Leevi
- Salasana kaikille: `helin2026`
- Istunto kestää 1 tunnin.

### API Endpointit
- `POST /api/auth` - Kirjautuminen
- `GET /api/events` - Hae tapahtumat
- `POST /api/events` - Lisää tapahtuma
- `DELETE /api/events/:id` - Poista tapahtuma

## Muokkaus

- Vaihda kuvatiedostojen polut `index.html`-tiedostossa, jos kuvatiedostot ovat eri kansiossa.
- Muokkaa tekstejä osioissa kuten `hero`, `gallery`, `blog`, `calendar` ja `family`.

## Huomio

- Varmista, että kaikki kuvat ovat JPG-muodossa ja käytettävissä.
- Jos kuvia on myös HEIC-muodossa, konvertoi ne JPG:ksi ennen käyttöä.
