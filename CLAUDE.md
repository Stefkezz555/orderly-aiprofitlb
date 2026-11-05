# Orderly: plan implementacije (test faza)

**Proizvod:** Orderly, interni dashboard porudžbina za više prodavnica
**Korisnici:** jedan tim, interno (uloge admin / manager / viewer)
**Kanali:** WooCommerce i Thinkific
**Stack:** Next.js 16 · TypeScript · Supabase · Clerk · Tailwind v4 · shadcn/ui · Recharts · SWR · Vercel · Resend
**Verzija plana:** 1.1 · novembar 2026 · format za A4 štampu

---

## Kako koristiti ovaj plan

Plan ima tri faze: **Faza 0 (Postavka)**, **Faza 1 (MVP: porudžbine ulaze i žive uživo)** i **Faza 2 (Analitika, TV i poliranje)**. Koraci idu po redu: kasniji korak zavisi samo od ranijih. Jedan korak je jedna radna sesija (oko 1 do 2 sata).

Svaki korak ima četiri dela:

- **Opis:** šta radimo i zašto.
- **Zadaci:** konkretni pod-koraci, sa nazivima fajlova i ruta.
- **Rezultat:** šta postoji i radi kad je korak gotov.
- **Napomena:** zamka koja tu tipično košta vreme, i kako je izbeći.

Tehnička podešavanja (Supabase, Clerk, Vercel, ključevi) radimo zajedno, klik po klik, kad dođemo do tog koraka. Ovde je samo spisak šta se radi.

Posle svakog koraka: commit na GitHub sa kratkim opisom („0.6 šema baze").

---

## Preduslovi (pre Faze 0)

1. **GitHub** nalog.
2. **Vercel** nalog, prijava preko GitHub-a. Hobby plan (besplatan) je za učenje i test. Za stvarnu upotrebu u firmi treba Pro.
3. **Supabase** nalog. Projekat pravimo u koraku 0.5, region Frankfurt.
4. **Clerk** nalog.
5. **WooCommerce** shop sa admin pristupom (za REST API ključeve i webhook).
6. **Thinkific** admin pristup. Proveri u adminu da li postoji sekcija za API ključ. Ako ne postoji, tvoj plan nema API i Thinkific korake (1.9 i 1.10) preskačemo do nadogradnje.
7. **Resend** nalog i domen za slanje mejlova (tek za Fazu 2).
8. Opciono: domen ili subdomen (npr. `orderly.tvojdomen.rs`). Za test je dovoljna besplatna Vercel adresa.

---

# FAZA 0: Postavka

Cilj: aplikacija postoji na internetu, login radi, baza je spremna, navigacija postoji. Još nema pravih podataka.

### Korak 0.1: Alati na računaru

- **Opis:** Instaliramo programe bez kojih ne možeš da pokreneš projekat. Radi se jednom.
- **Zadaci:**
  - Instalirati Node.js (LTS verzija) i proveriti u terminalu `node -v` i `npm -v`.
  - Instalirati Git i podesiti ime i email (`git config --global user.name` / `user.email`).
  - Instalirati VS Code i Claude Code.
  - Napraviti folder `Projekti` gde će živeti svi projekti.
- **Rezultat:** Terminal prepoznaje `node`, `npm` i `git`; Claude Code se pokreće.
- **Napomena:** Na Windows-u posle instalacije Node-a zatvori i ponovo otvori terminal, inače `node` „ne postoji". Ne stavljaj projekat u folder sa razmacima ili OneDrive sinhronizacijom; pravi čudne greške pri pokretanju.

### Korak 0.2: Novi Next.js projekat i GitHub

- **Opis:** Pravimo prazan Next.js 16 projekat i povezujemo ga sa GitHub-om, da svaka izmena ima istoriju.
- **Zadaci:**
  - `npx create-next-app@latest orderly` (TypeScript: da, ESLint: da, App Router: da, Turbopack: da, `src/` folder: ne).
  - Napraviti foldere: `components/`, `lib/`, `supabase/migrations/`.
  - Dodati `CLAUDE.md` sa pravilima projekta (stack, jezik interfejsa, da se pre pisanja koda čita dokumentacija iz `node_modules/next/dist/docs/`).
  - Napraviti repo na GitHub-u, prvi commit i push.
- **Rezultat:** `npm run dev` otvara početnu stranicu na `http://localhost:3000`; kod je na GitHub-u.
- **Napomena:** Next.js 16 se razlikuje od starijih verzija (npr. `middleware.ts` je sada `proxy.ts`). AI asistenti često pišu kod za stariju verziju; pravilo u `CLAUDE.md` to sprečava. Proveri da je instalirana najnovija 16.x verzija, zbog bezbednosnih zakrpa.

### Korak 0.3: Dizajn sistem i Tailwind v4

- **Opis:** Postavljamo boje, font i senke Orderly-ja na jednom mestu, da cela aplikacija izgleda isto.
- **Zadaci:**
  - U `app/globals.css`: `@import "tailwindcss"` i `@import "tw-animate-css"`.
  - U `:root` upisati brend tokene (boje, senke, tranzicije) iz dodatka „Dizajn sistem"; u `@theme inline` ih mapirati da rade kao Tailwind klase.
  - Učitati Geist font preko `next/font/google` u `app/layout.tsx` i staviti `geist.className` na `<body>`.
  - Napraviti probnu stranicu `app/test/page.tsx` sa bojama i naslovima.
- **Rezultat:** Probna stranica prikazuje brend boje, Geist font i senke.
- **Napomena:** Tailwind v4 nema `tailwind.config.ts`; sve ide u `globals.css`. Ako font „ne hvata", proveri da koristiš `geist.className`, ne `geist.variable`.

### Korak 0.4: Gotove komponente (shadcn/ui)

- **Opis:** Dodajemo gotova dugmad, kartice, tabele i prozore, da ih ne pravimo od nule.
- **Zadaci:**
  - `npx shadcn@latest init` (osnovna boja: neutral, ikone: lucide).
  - Dodati komponente: button, card, input, label, dialog, sheet, table, tabs, select, popover, dropdown-menu, badge, switch, avatar, separator, tooltip, skeleton, sonner (obaveštenja).
  - Proveriti da `lib/utils.ts` ima funkciju `cn`.
- **Rezultat:** Na probnoj stranici rade dugme, kartica i prozor u brend bojama.
- **Napomena:** shadcn komponente se kopiraju u `components/ui/` i postaju tvoj kod. Ne menjaj ih direktno za jednu stranicu; za posebne slučajeve pravi novu komponentu oko njih.

### Korak 0.5: Supabase projekat i env varijable

- **Opis:** Pravimo bazu i povezujemo je sa projektom preko tajnih ključeva.
- **Zadaci:**
  - Napraviti Supabase projekat (region Frankfurt), sačuvati lozinku baze.
  - Napraviti `.env.local` sa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
  - Proveriti da je `.env.local` u `.gitignore`.
  - Instalirati `@supabase/supabase-js`.
- **Rezultat:** Projekat ima ključeve; `.env.local` nije na GitHub-u.
- **Napomena:** `SUPABASE_SERVICE_ROLE_KEY` zaobilazi svu zaštitu baze. Nikad ga ne stavljaj u promenljivu koja počinje sa `NEXT_PUBLIC_` i nikad ga ne šalji u chat ili na GitHub. Ako procuri, odmah ga promeni u Supabase podešavanjima.

### Korak 0.6: Šema baze

- **Opis:** Pravimo sve tabele odjednom, jednom SQL migracijom, da kasniji koraci imaju gde da upisuju.
- **Zadaci:**
  - `supabase/migrations/001_initial_schema.sql` sa 9 tabela: `sites`, `customers`, `orders`, `order_items`, `products`, `subscriptions`, `settings`, `sync_log`, `sound_settings`.
  - `sites.platform` sa proverom (`woocommerce`, `thinkific`).
  - `orders`: `UNIQUE(site_id, external_order_id)`, kolone `currency`, `total`, `net_profit`, `status`, `created_at` (datum sa izvora), `updated_at`.
  - `customers.email` UNIQUE.
  - `settings`: `key` UNIQUE, `value` JSONB.
  - Pokrenuti SQL u Supabase SQL Editoru.
- **Rezultat:** Svih 9 tabela vidi se u Supabase Table Editoru.
- **Napomena:** `created_at` na `orders` čuva originalni datum porudžbine, ne datum upisa. Ako ovo pogrešiš, svi istorijski grafici kasnije pokazuju da je sve prodato danas.

### Korak 0.7: Zaštita tabela (RLS) i indeksi

- **Opis:** Uključujemo pravila ko sme šta da čita i dodajemo indekse da upiti budu brzi.
- **Zadaci:**
  - `supabase/migrations/002_rls_indexes.sql`.
  - Uključiti RLS na svih 9 tabela.
  - Na svaku tabelu policy `authenticated_read` (SELECT za ulogu `authenticated`). Upise radi samo server preko service role ključa.
  - Indeksi: `orders(site_id)`, `orders(created_at DESC)`, `orders(status)`, `orders(customer_email)`, `order_items(order_id)`, `customers(email)`.
- **Rezultat:** U Supabase-u svaka tabela ima zeleni RLS znak; indeksi postoje.
- **Napomena:** Ne pravi policy za ulogu `anon` sa `USING (true)`. `anon` ključ je javan (vidi ga svako u browseru), pa bi takvo pravilo dalo svakome čitanje svih porudžbina i email-ova kupaca. Real-time ćemo rešiti preko prijavljenog korisnika (korak 0.10).

### Korak 0.8: Login (Clerk) i zaštita ruta

- **Opis:** Bez prijave niko ne vidi aplikaciju, osim ruta koje prodavnice i cron moraju da dosegnu.
- **Zadaci:**
  - Napraviti Clerk aplikaciju, dodati `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` i `CLERK_SECRET_KEY` u `.env.local`.
  - Instalirati `@clerk/nextjs`, dodati `<ClerkProvider>` u `app/layout.tsx`.
  - Stranice: `app/(auth)/sign-in/[[...sign-in]]/page.tsx` i `app/(auth)/sign-up/[[...sign-up]]/page.tsx`.
  - `proxy.ts` u korenu projekta: `clerkMiddleware` + `createRouteMatcher`. Javne rute: `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhook/(.*)`, `/api/cron/(.*)`. Sve ostalo `auth.protect()`.
- **Rezultat:** Neprijavljen korisnik se vraća na prijavu; posle prijave vidi aplikaciju.
- **Napomena:** Dve klasične greške. Stranica prijave mora biti catch-all (`[[...sign-in]]`), inače Clerk baca grešku. Webhook i cron rute moraju biti javne u `proxy.ts`; ako nisu, prodavnica dobija odbijenicu (401) i porudžbine se ne upisuju, a ti ne vidiš nikakvu grešku u aplikaciji.

### Korak 0.9: Tim i uloge (Clerk Organizations)

- **Opis:** Pravimo jedan tim i tri uloge, da viewer može da gleda, a samo admin da menja podešavanja.
- **Zadaci:**
  - U Clerk dashboard-u uključiti Organizations i napraviti organizaciju „Orderly tim".
  - Uloge: `org:admin`, `org:manager`, `org:viewer`.
  - Isključiti mogućnost da korisnik sam pravi nove organizacije.
  - `lib/auth/roles.ts`: pomoćne funkcije `requireRole('admin')` za API rute.
- **Rezultat:** Možeš da pozoveš člana mejlom i dodeliš mu ulogu; `requireRole` odbija pogrešnu ulogu.
- **Napomena:** Ako tvoj Clerk plan ne dozvoljava sopstvene uloge, rešenje je uloga u `publicMetadata` korisnika (`{ role: "viewer" }`), a `requireRole` čita odatle. Ostatak plana se ne menja.

### Korak 0.10: Povezivanje Clerk-a i Supabase-a + klijenti

- **Opis:** Supabase sam ne zna ko je prijavljen preko Clerk-a. Povezujemo ih, da baza prepozna prijavljenog korisnika kao `authenticated`.
- **Zadaci:**
  - U Clerk-u uključiti Supabase integraciju; u Supabase-u (Authentication, Third-Party Auth) dodati Clerk sa Clerk domenom.
  - `lib/supabase/browser-client.ts`: jedan klijent za ceo browser (napravljen jednom, na nivou modula) sa opcijom `accessToken` koja vraća Clerk token.
  - `lib/supabase/server.ts`: klijent za server komponente, token iz Clerk `auth().getToken()`.
  - `lib/supabase/admin.ts`: klijent sa service role ključem, samo za webhook, sync i cron rute.
  - Probna stranica čita `sites` kao prijavljen korisnik (prazan rezultat bez greške = radi).
- **Rezultat:** Prijavljen korisnik čita iz baze; neprijavljen ne može.
- **Napomena:** Browser klijent mora biti napravljen jednom. Ako se pravi unutar komponente, svaki prikaz otvara novu real-time vezu i ona se beskonačno zatvara i otvara. Server klijent ovde ne koristi kolačiće (`cookies()`) kao u Supabase primerima, jer login radi Clerk, ne Supabase.

### Korak 0.11: Objavljivanje na Vercel

- **Opis:** Aplikacija izlazi na internet. Webhook-ovi kasnije moraju da gađaju ovu adresu.
- **Zadaci:**
  - Uvesti GitHub repo u Vercel (automatsko objavljivanje sa `main` grane).
  - Uneti sve env varijable (Supabase 3, Clerk 2, `CRON_SECRET` sa nasumičnim nizom).
  - U Clerk-u dodati Vercel adresu kao dozvoljenu.
  - Opciono: povezati sopstveni domen.
- **Rezultat:** Na Vercel adresi radi prijava i probna stranica.
- **Napomena:** Env varijable na Vercel-u ne dolaze iz `.env.local`; svaku unosiš ručno. Posle unosa ili izmene uradi „Redeploy", inače aplikacija i dalje vidi stare vrednosti.

### Korak 0.12: Skelet dashboard-a

- **Opis:** Pravimo zajednički okvir svih ekrana: meni levo, traka gore, sadržaj u sredini.
- **Zadaci:**
  - `app/(dashboard)/layout.tsx`: sidebar 220px + header + `<main>`.
  - `components/dashboard/sidebar.tsx`: Dashboard, Analitika, Kupci, Pretplate, Profit, Podešavanja (Opšte, Sajtovi, Zvuk), TV prikaz; aktivna stavka po `usePathname`; `UserButton` dole.
  - `components/dashboard/header.tsx`: mesto za meni na mobilnom, prekidač zvuka, prazan prostor za obaveštenja.
  - Prazne stranice za svaku stavku menija (naslov „Uskoro").
- **Rezultat:** Kroz aplikaciju se kreće menijem; na telefonu meni se otvara iz trake.
- **Napomena:** Clerk `UserButton` ponekad pravi upozorenje „hydration" u konzoli. Rešava se tako da sidebar bude client komponenta (`"use client"`) ili da se `UserButton` učita tek u browseru.

---

# FAZA 1: MVP (porudžbine ulaze i žive uživo)

Cilj: porudžbine sa WooCommerce-a i Thinkific-a ulaze same, a dashboard ih prikazuje uživo, sa KPI brojkama, tabelom, valutom i zvukom.

### Korak 1.1: Sajtovi, serverski deo

- **Opis:** API za dodavanje i menjanje prodavnica. Sve kasnije počinje od zapisa u `sites`.
- **Zadaci:**
  - `app/api/sites/route.ts` (GET lista, POST novi).
  - `app/api/sites/[id]/route.ts` (PATCH izmena, DELETE brisanje).
  - Provera ulaza (obavezna polja, ispravan URL).
  - POST, PATCH i DELETE dozvoljeni samo za `admin` (`requireRole`).
  - GET ne vraća ključeve prodavnica, samo da li su uneti.
- **Rezultat:** Preko API-ja se dodaje, menja i briše sajt; viewer dobija odbijenicu za izmene.
- **Napomena:** Ključevi prodavnica (consumer key/secret, Thinkific API ključ) nikad ne idu nazad u browser. Ako ih API vraća, svako ko otvori alatke za programere u browseru ih vidi.

### Korak 1.2: Sajtovi, ekran

- **Opis:** Forma u kojoj admin dodaje prodavnicu bez diranja baze.
- **Zadaci:**
  - `app/(dashboard)/settings/sites/page.tsx` + `components/settings/sites-manager.tsx`.
  - Polja: ime, platforma, URL, ključevi, tajna za webhook, boja (`color_hex`), podrazumevana marža (%).
  - Lista sajtova sa bojom, dugmad Izmeni i Obriši (uz potvrdu).
  - Prikaz webhook adrese za svaki sajt (za kopiranje u korak 1.6).
- **Rezultat:** Admin kroz ekran dodaje tvoj test shop; on se pojavljuje u listi sa svojom bojom.
- **Napomena:** Nema posebne zamke.

### Korak 1.3: Pretvaranje WooCommerce porudžbine

- **Opis:** Jedna funkcija pretvara porudžbinu iz WooCommerce-a u naš oblik. Koriste je i webhook i sync, da rezultat bude uvek isti.
- **Zadaci:**
  - `lib/sync/normalize-woo-order.ts`: ulaz je sirova porudžbina, izlaz `orderRow` + `itemRows`.
  - `created_at` iz `date_created_gmt`, `updated_at` iz `date_modified_gmt`, `currency` iz porudžbine.
  - Tip stavke: `digital` ako je proizvod virtuelan ili za preuzimanje, inače `physical`.
  - `net_profit`: trošak po proizvodu iz `products`, ako ga nema podrazumevana marža sajta; oduzeti procenat provizije za kartična plaćanja (podesiv po sajtu).
  - Probni fajl sa jednom pravom porudžbinom (JSON) i provera rezultata.
- **Rezultat:** Za probnu porudžbinu funkcija vraća ispravan red sa tačnim datumom i profitom.
- **Napomena:** Koristi `_gmt` datume. Obični `date_created` je u vremenskoj zoni prodavnice, pa se porudžbine posle ponoći pomeraju na pogrešan dan.

### Korak 1.4: Upis u bazu (DB pomoćnici)

- **Opis:** Funkcije koje upisuju porudžbinu i kupca tako da dupli upis ne pravi duplikat.
- **Zadaci:**
  - `lib/sync/db.ts`:
    - `upsertOrder`: upis ili izmena po `(site_id, external_order_id)`, pa zamena stavki u `order_items`.
    - `upsertCustomer`: jedan kupac po email-u (mala slova, bez razmaka); ažurira broj porudžbina i ukupnu potrošnju.
    - `logSync`: upis u `sync_log` (sajt, izvor, broj, greška).
  - Sve preko admin klijenta.
- **Rezultat:** Dvostruko pozivanje sa istom porudžbinom ostavlja jedan red u `orders`.
- **Napomena:** Ukupnu potrošnju kupca računaj iz baze (zbir njegovih porudžbina), ne dodavanjem na staro. Inače svaka izmena iste porudžbine (npr. promena statusa) duplo uvećava iznos.

### Korak 1.5: WooCommerce webhook ruta

- **Opis:** Adresa na koju prodavnica javlja svaku novu ili izmenjenu porudžbinu.
- **Zadaci:**
  - `app/api/webhook/woo/[siteId]/route.ts` (POST).
  - Čitanje sirovog tela zahteva, provera potpisa `x-wc-webhook-signature` = HMAC-SHA256 tela sa tajnom webhook-a, u base64.
  - Neispravan potpis: odgovor 401.
  - Ispravan: normalizacija, `upsertOrder`, `upsertCustomer`, `logSync`, odgovor 200. Greška u obradi se upisuje u `sync_log`, a odgovor je i dalje 200.
- **Rezultat:** Ruta prihvata ispravno potpisan zahtev i odbija lažan.
- **Napomena:** Kad napraviš webhook, WooCommerce prvo pošalje probni „ping" koji nije porudžbina (telo je `webhook_id=...`). Ruta mora na njega da vrati 200, inače WooCommerce označi webhook kao neispravan i posle 5 neuspeha ga sam isključi.

### Korak 1.6: Povezivanje WooCommerce-a i test uživo

- **Opis:** U prodavnici registrujemo webhook i proveravamo da porudžbina stiže.
- **Zadaci:**
  - U WooCommerce-u (Podešavanja, Napredno, Webhooks) napraviti dva webhook-a: „Order created" i „Order updated", adresa sa Vercel-a iz koraka 1.2, tajna ista kao u sajtu.
  - Napraviti probnu porudžbinu u prodavnici.
  - Proveriti red u `orders` i zapis u `sync_log`.
- **Rezultat:** Probna porudžbina se pojavi u bazi za nekoliko sekundi.
- **Napomena:** Webhook ne može da se testira na `localhost`; prodavnica ne vidi tvoj računar. Uvek koristi Vercel adresu. Ako tabela ostane prazna, prvo pogledaj u WooCommerce „Logs" šta je ruta odgovorila.

### Korak 1.7: WooCommerce istorija (sync)

- **Opis:** Učitavamo stare porudžbine, jer webhook javlja samo nove.
- **Zadaci:**
  - `lib/sync/sync-woo-site.ts`: WooCommerce REST API, stranice po 100, od najstarije, opcioni datum „posle".
  - `app/api/sync/woo/[siteId]/route.ts` i `app/api/sync/all/route.ts` (samo admin i manager).
  - Isti `normalize` i `upsert` kao webhook.
- **Rezultat:** Sve porudžbine iz izabranog perioda su u bazi sa tačnim originalnim datumima.
- **Napomena:** Vercel prekida funkciju posle ograničenog vremena. Za veliku istoriju ne vuci sve u jednom pozivu: obradi nekoliko stranica, vrati „nastavi od stranice X", a dugme poziva ponovo dok ne završi.

### Korak 1.8: Dugme za sync

- **Opis:** Ručno pokretanje sync-a iz aplikacije.
- **Zadaci:**
  - `components/dashboard/sync-button.tsx`: prozor sa izborom perioda (od početka godine, 90 dana, sve).
  - Prikaz napretka (broj obrađenih) i poruka na kraju.
  - Dugme na stranici Sajtovi.
- **Rezultat:** Klikom se pokreće sync i vidi se koliko porudžbina je ušlo.
- **Napomena:** Zaključaj dugme dok sync traje, da dva klika ne pokrenu dva sync-a odjednom.

### Korak 1.9: Thinkific sync

- **Opis:** Drugi kanal, kursevi, po istom obrascu kao WooCommerce.
- **Zadaci:**
  - Proveriti da Thinkific plan ima API (Preduslovi, tačka 6).
  - `lib/sync/normalize-thinkific-order.ts` i `lib/sync/sync-thinkific-site.ts` (zaglavlja `X-Auth-API-Key` i `X-Auth-Subdomain`).
  - `app/api/sync/thinkific/[siteId]/route.ts`.
  - `product_type = 'digital'`, izvor `thinkific`.
- **Rezultat:** Prodaje kurseva su u istoj tabeli `orders`; kupac koji je kupio i u shopu i kurs je jedan kupac.
- **Napomena:** Ako API sekcija u Thinkific adminu ne postoji, korake 1.9 i 1.10 preskoči. MVP radi i samo sa WooCommerce-om.

### Korak 1.10: Thinkific webhook

- **Opis:** Nove prodaje kurseva stižu same, kao kod WooCommerce-a.
- **Zadaci:**
  - `app/api/webhook/thinkific/[siteId]/route.ts`.
  - Provera potpisa `X-Thinkific-Hmac-Sha256` (HMAC-SHA256 tela sa API ključem, u hex obliku).
  - Registrovati webhook za `order.created` u Thinkific adminu.
  - Probna kupovina kursa (besplatni kupon) i provera u bazi.
- **Rezultat:** Prodaja kursa se pojavi u `orders` za nekoliko sekundi.
- **Napomena:** WooCommerce šalje potpis u base64, Thinkific u hex obliku. Ako kopiraš proveru iz Woo rute bez izmene, svaki Thinkific zahtev biće odbijen.

### Korak 1.11: Više valuta

- **Opis:** Sve brojke prikazujemo u jednoj osnovnoj valuti, bez obzira u kojoj je porudžbina plaćena. Radimo pre KPI-ja jer ga KPI koristi.
- **Zadaci:**
  - `lib/utils/fx.ts`: `loadFxSettings()` čita `base_currency` i `exchange_rates` iz `settings`; `toBase(iznos, valuta, kursevi)`.
  - `lib/utils/currency.ts`: `formatCurrency()` za RSD, EUR, USD.
  - `app/(dashboard)/settings/general/page.tsx` + `app/api/settings/route.ts` (izmena samo admin).
  - Početne vrednosti: osnovna valuta EUR, kursevi za RSD i USD.
- **Rezultat:** Promena osnovne valute u podešavanjima menja prikaz svih iznosa.
- **Napomena:** Kursevi su ručni i zastare. Na ekranu podešavanja prikaži datum poslednje izmene kursa, da se vidi kad treba ažurirati.

### Korak 1.12: Real-time, baza i hook

- **Opis:** Baza šalje svaku novu porudžbinu u browser odmah, bez osvežavanja.
- **Zadaci:**
  - U Supabase-u dodati `orders` u real-time objavljivanje (Database, Publications, `supabase_realtime`).
  - `lib/hooks/use-realtime-orders.ts`: pretplata na INSERT i UPDATE nad `orders`, preko browser klijenta iz 0.10.
  - Ponovno povezivanje posle prekida; dopuna boje i imena sajta iz keša.
  - Probna stranica koja ispisuje svaku porudžbinu koja stigne.
- **Rezultat:** Probna porudžbina se pojavi na probnoj stranici bez osvežavanja.
- **Napomena:** Ako događaji ne stižu, skoro uvek je razlog što Supabase ne vidi korisnika kao prijavljenog. Proveri korak 0.10 (Clerk token u klijentu). Ne rešavaj to javnim `anon` pravilom (vidi 0.7).

### Korak 1.13: Real-time za ceo dashboard

- **Opis:** Jedna veza za celu aplikaciju, koju dele svi delovi ekrana.
- **Zadaci:**
  - `lib/contexts/realtime-orders-context.tsx`: jedna pretplata na nivou layout-a; `subscribeToNewOrders(callback)` za delove ekrana.
  - Ponovno učitavanje današnjih porudžbina kad se kartica browsera vrati u fokus (Page Visibility API).
  - Provera veze na 30 sekundi.
  - Umotati `app/(dashboard)/layout.tsx` u `RealtimeOrdersProvider`.
- **Rezultat:** Ceo dashboard dobija nove porudžbine iz jedne veze; posle vraćanja na karticu podaci su sveži.
- **Napomena:** Browser usporava veze u karticama koje nisu u fokusu, pa feed „zamrzne". Ponovno učitavanje na povratak fokusa nije opciono, bez njega TV i zaboravljene kartice pokazuju stare podatke.

### Korak 1.14: KPI, serverski deo

- **Opis:** Računamo pet glavnih brojki za izabrani period, sa poređenjem prema prethodnom periodu.
- **Zadaci:**
  - `app/api/stats/kpi/route.ts`: prihod, broj porudžbina, prosečna porudžbina (AOV), neto profit, novi kupci; sve u osnovnoj valuti.
  - Parametri: period (danas, 7 dana, 30 dana, mesec), sajt (opciono).
  - Isto za prethodni period i procenat promene.
  - Brojati samo porudžbine sa statusom koji je stvarna prodaja (npr. `processing`, `completed`); lista statusa u `settings`.
- **Rezultat:** API vraća pet brojki i procente promene za izabrani period.
- **Napomena:** AOV = ukupan prihod / broj porudžbina, u istom periodu i sa istim statusima. Ako brojilac i imenilac koriste različite filtere (npr. prihod bez otkazanih, a broj sa otkazanim), AOV je pogrešan.

### Korak 1.15: KPI kartice i mini-grafici

- **Opis:** Gornji red dashboard-a: pet kartica sa brojem, procentom promene i malim grafikom.
- **Zadaci:**
  - `lib/hooks/use-kpi-stats.ts` (SWR, osvežavanje na 60 s i na novu porudžbinu iz konteksta).
  - `app/api/stats/sparklines/route.ts` + `lib/hooks/use-sparklines.ts`.
  - `components/dashboard/kpi-card.tsx`, `kpi-section.tsx`, `kpi-filters.tsx`, `sparkline.tsx`.
  - `app/(dashboard)/dashboard/page.tsx` prikazuje KPI sekciju.
- **Rezultat:** Dashboard prikazuje 5 kartica; nova porudžbina menja brojke bez osvežavanja stranice.
- **Napomena:** Dok se podaci učitavaju, prikaži sivi „skeleton", ne nulu. Nula na trenutak izgleda kao da je prodaja pala i zbunjuje tim.

### Korak 1.16: Live feed

- **Opis:** Uspravna lista današnjih porudžbina, nova uleće na vrh sa animacijom.
- **Zadaci:**
  - `components/dashboard/live-feed.tsx`: pri otvaranju učita današnje porudžbine iz baze, posle sluša kontekst.
  - Prikaz: naziv proizvoda (iz `order_items`), iznos u osnovnoj valuti, vreme, boja sajta.
  - Animacija ulaska: klizanje odozgo, pojavljivanje i kratak bljesak u brend boji.
  - Najviše 50 stavki.
- **Rezultat:** Feed prikazuje današnje porudžbine i animira svaku novu.
- **Napomena:** Ne čuvaj feed u `sessionStorage`; pravi „duhove" porudžbina od juče. Pri otvaranju uvek učitaj sveže iz baze.

### Korak 1.17: Tabela porudžbina

- **Opis:** Kompletan spisak porudžbina sa detaljima na klik.
- **Zadaci:**
  - `components/dashboard/orders-table.tsx` (server) + `orders-table-client.tsx`.
  - 25 po stranici, sortiranje po datumu.
  - Klik na red otvara bočnu fioku (Sheet) sa stavkama, kupcem, statusom i profitom.
- **Rezultat:** Tabela na dashboard-u prikazuje porudžbine; klik otvara detalje.
- **Napomena:** Nema posebne zamke.

### Korak 1.18: Filteri

- **Opis:** Filtriranje tabele po sajtu, statusu i periodu, tako da filter ostaje u adresi i može da se podeli linkom.
- **Zadaci:**
  - `components/dashboard/filter-bar.tsx`: filteri upisani u adresu (`?site=...&status=...&period=...`).
  - Tabela i KPI čitaju iste filtere.
  - Dugme „Poništi filtere".
- **Rezultat:** Izbor filtera menja tabelu; link sa filterima otvara isti prikaz.
- **Napomena:** Komponenta koja čita adresu (`useSearchParams`) mora biti umotana u `<Suspense>`, inače objavljivanje na Vercel puca. Opcija „svi" mora da piše „Sve", ne interni ključ tipa `__all`.

### Korak 1.19: Zvuk za novu porudžbinu

- **Opis:** Kad stigne porudžbina, čuje se zvuk, različit po sajtu.
- **Zadaci:**
  - `lib/hooks/use-sound-notification.ts` (Web Audio API).
  - `lib/contexts/sound-context.tsx`: `SoundProvider`, uključeno/isključeno pamti se u `localStorage`.
  - `components/dashboard/sound-subscriber.tsx`: sluša kontekst i pušta zvuk za statuse iz podešavanja.
  - Prekidač zvuka u header-u; podrazumevani zvuk u `public/sounds/`.
- **Rezultat:** Probna porudžbina pušta zvuk; prekidač ga gasi.
- **Napomena:** Browser ne dozvoljava zvuk dok korisnik ne klikne nešto na stranici. Zato prvi klik bilo gde „otključava" zvuk (`unlockAudio()`); bez toga zvuk ćuti i izgleda kao da ne radi.

### Korak 1.20: Podešavanja zvuka

- **Opis:** Admin bira zvuk, jačinu i statuse po sajtu.
- **Zadaci:**
  - Supabase Storage folder (bucket) `sounds`.
  - `app/(dashboard)/settings/sound/page.tsx`.
  - `app/api/sound-settings/route.ts` i `app/api/sound-settings/upload/route.ts` (samo admin; dozvoljeni mp3 i wav do 1 MB).
  - Dugme „Probaj zvuk".
- **Rezultat:** Svaki sajt ima svoj zvuk i jačinu; promena važi bez ponovnog učitavanja.
- **Napomena:** Proveravaj tip i veličinu fajla na serveru, ne samo u formi. Forma se lako zaobiđe.

### Korak 1.21: Dnevni sync (sigurnosna mreža)

- **Opis:** Jednom dnevno povlačimo porudžbine iz poslednja 2 dana, za slučaj da je neki webhook promašio.
- **Zadaci:**
  - `app/api/cron/daily-sync/route.ts`: proverava `Authorization: Bearer CRON_SECRET`, pa pokreće sync svih sajtova za poslednjih 48 sati.
  - `vercel.json`: cron `0 3 * * *`.
  - Rezultat se upisuje u `sync_log`.
- **Rezultat:** U `sync_log` svakog jutra postoji zapis dnevnog sync-a.
- **Napomena:** Vercel cron radi po UTC vremenu, a na Hobby planu ide jednom dnevno i može da kasni do sat vremena. Ovaj poziv usput drži Supabase projekat aktivnim, pa se besplatan projekat ne pauzira zbog neaktivnosti.

---

# FAZA 2: Analitika, TV i poliranje

Cilj: grafici, profit, kupci, pretplate, prognoza, TV prikaz u kancelariji i email rezime; aplikacija spremna za stvarnu upotrebu.

### Korak 2.1: Grafik prihoda

- **Opis:** Linijski grafik prihoda kroz vreme.
- **Zadaci:**
  - `app/(dashboard)/analytics/page.tsx`.
  - `app/api/analytics/daily-revenue/route.ts` (po danu, nedelji ili mesecu, u osnovnoj valuti).
  - `components/dashboard/charts/daily-revenue-chart.tsx` (Recharts), učitan tek kad zatreba (`next/dynamic`).
- **Rezultat:** Stranica Analitika prikazuje prihod sa izborom dan/nedelja/mesec.
- **Napomena:** Dani bez prodaje moraju biti na grafiku kao 0, inače linija preskače dane i grafik laže.

### Korak 2.2: Statusi i poređenje perioda

- **Opis:** Raspodela porudžbina po statusu i poređenje sa prethodnim periodom.
- **Zadaci:**
  - `app/api/analytics/status-breakdown/route.ts` + `charts/status-breakdown-chart.tsx`.
  - `charts/monthly-comparison-card.tsx`.
- **Rezultat:** Analitika prikazuje udeo statusa i ovaj mesec prema prošlom.
- **Napomena:** Poredi isti broj dana (npr. 1. do 15. ovog meseca sa 1. do 15. prošlog), ne ceo prošli mesec sa pola tekućeg.

### Korak 2.3: Dashboard jednog sajta

- **Opis:** Isti dashboard, ali samo za jednu prodavnicu.
- **Zadaci:**
  - `app/(dashboard)/dashboard/[siteId]/page.tsx`: KPI, feed i tabela filtrirani po sajtu; boja sajta u zaglavlju; dugme za sync.
  - Linkovi sa liste sajtova i iz feed-a.
- **Rezultat:** Klik na sajt otvara njegov dashboard.
- **Napomena:** Nema posebne zamke.

### Korak 2.4: Troškovi proizvoda (COGS)

- **Opis:** Unos troška po proizvodu, da profit bude stvaran, a ne procena.
- **Zadaci:**
  - `app/(dashboard)/profit/products/page.tsx`: lista proizvoda sa poljima trošak u % ili fiksni iznos.
  - `app/api/profit/products/route.ts` (izmena samo admin i manager).
  - Proizvodi se pune iz `order_items` (svaki prodat proizvod dobija red u `products`).
- **Rezultat:** Svaki proizvod može da ima unet trošak.
- **Napomena:** Nema posebne zamke.

### Korak 2.5: Profit dashboard i preračun

- **Opis:** Bruto prema neto, profit po proizvodu i preračun starih porudžbina posle izmene troškova.
- **Zadaci:**
  - `app/(dashboard)/profit/page.tsx`.
  - `app/api/profit/kpi/route.ts`.
  - `app/api/profit/recalculate/route.ts`: ponovo računa `net_profit` za izabrani period (samo admin, u delovima kao sync).
- **Rezultat:** Profit stranica prikazuje bruto, neto i maržu; preračun menja istoriju.
- **Napomena:** Pre preračuna prikaži broj porudžbina koje će se promeniti i traži potvrdu. Preračun prepisuje istorijske brojke.

### Korak 2.6: Najprodavaniji proizvodi

- **Opis:** Koji proizvodi donose najviše, po prihodu i komadima.
- **Zadaci:**
  - `app/api/analytics/top-products/route.ts` (zbir iz `order_items`).
  - `charts/top-products-chart.tsx` sa strelicom trenda prema prethodnom periodu.
- **Rezultat:** Lista top 10 proizvoda sa trendom.
- **Napomena:** Nema posebne zamke.

### Korak 2.7: Lista kupaca

- **Opis:** Svi kupci sa ukupnom potrošnjom (LTV), brojem i prosekom porudžbina.
- **Zadaci:**
  - `app/(dashboard)/customers/page.tsx` + `app/api/customers/route.ts`.
  - Sortiranje po LTV, broju porudžbina, poslednjoj kupovini; pretraga po email-u i imenu.
- **Rezultat:** Lista kupaca sa sortiranjem i pretragom.
- **Napomena:** Email i ime kupca su lični podaci. Viewer uloga treba da vidi skraćen email (npr. `m***@gmail.com`).

### Korak 2.8: Profil kupca

- **Opis:** Sve porudžbine jednog kupca, sa svih kanala, na jednom mestu.
- **Zadaci:**
  - `app/(dashboard)/customers/[id]/page.tsx` + `app/api/customers/[id]/route.ts`.
  - Vremenska linija porudžbina, kanali, ukupno potrošeno.
- **Rezultat:** Klik na kupca otvara njegovu istoriju.
- **Napomena:** Nema posebne zamke.

### Korak 2.9: Pretplate

- **Opis:** Mesečni ponavljajući prihod (MRR), otkazivanja (churn) i broj aktivnih pretplata.
- **Zadaci:**
  - Utvrditi izvor: WooCommerce Subscriptions dodatak ili Thinkific pretplate.
  - Sync pretplata u tabelu `subscriptions`.
  - `app/(dashboard)/subscriptions/page.tsx` + `app/api/subscriptions/route.ts`: MRR trend, churn, podela po statusu.
- **Rezultat:** Stranica Pretplate prikazuje MRR i churn.
- **Napomena:** Ako nijedan shop nema pretplate, ovaj korak preskoči i sakrij stavku iz menija. Prazna stranica samo zbunjuje tim.

### Korak 2.10: Dnevni cilj

- **Opis:** Traka napretka ka dnevnom cilju prihoda.
- **Zadaci:**
  - `components/dashboard/daily-goal-tracker.tsx`; cilj iz `settings` (`goal_daily_global`), unos u Opštim podešavanjima.
  - Animacija trake (`--transition-spring`).
- **Rezultat:** Dashboard prikazuje koliko procenata dnevnog cilja je ostvareno.
- **Napomena:** „Danas" računaj po vremenskoj zoni tima (Europe/Belgrade), ne po UTC. Inače se cilj resetuje u 1 ili 2 posle ponoći umesto u ponoć.

### Korak 2.11: Prognoza prihoda

- **Opis:** Procena prihoda za narednih 30 dana na osnovu istorije.
- **Zadaci:**
  - `app/api/analytics/forecast/route.ts`: jednostavna linearna regresija na nedeljnim zbirovima.
  - `components/dashboard/forecasting-section.tsx`: isprekidana linija na grafiku prihoda, prekidač uključi/isključi.
- **Rezultat:** Grafik prihoda može da prikaže prognozu.
- **Napomena:** Sa manje od 8 nedelja podataka prognoza je besmislena. Tada prikaži poruku umesto linije.

### Korak 2.12: Kohorte kupaca

- **Opis:** Koliko kupaca iz svakog meseca prve kupovine se vraća kasnije.
- **Zadaci:**
  - `app/api/analytics/cohort/route.ts`: mesečne kohorte i prihod po mesecima posle prve kupovine.
  - Tabela-matrica sa bojom po jačini.
- **Rezultat:** Analitika prikazuje kohort matricu.
- **Napomena:** Nema posebne zamke.

### Korak 2.13: TV prikaz

- **Opis:** Ekran preko celog TV-a u kancelariji: KPI, feed i zvuk, sa smenjivanjem prikaza.
- **Zadaci:**
  - `app/tv/page.tsx` + `app/tv/tv-content.tsx`: bez menija, veliki fontovi, smenjivanje prikaza (interval iz `settings`).
  - TV animacije: `tv-fade-in`, `tv-marquee`, `tv-row-in`.
  - `TVSoundProvider` (zvuk uvek uključen).
  - Poseban Clerk nalog „TV" sa ulogom viewer; TV ostaje prijavljen.
  - Browser na TV-u u kiosk režimu, sa automatskim pokretanjem.
- **Rezultat:** `/tv` na TV-u prikazuje živ dashboard i zvoni na nove porudžbine.
- **Napomena:** Ne pravi `/tv` javnim. Javna stranica sa porudžbinama je dostupna svakome ko pogodi adresu. Prijavljen viewer nalog daje isto, a bezbedno. Ugasi spavanje ekrana na TV-u i proveri ujutru da li je sesija i dalje aktivna.

### Korak 2.14: Email servis (Resend)

- **Opis:** Priprema za slanje mejlova sa sopstvenog domena.
- **Zadaci:**
  - Resend nalog, dodati domen i DNS zapise (SPF, DKIM) kod registrara domena.
  - `RESEND_API_KEY` u `.env.local` i na Vercel.
  - `lib/email/send.ts` i probni mejl na tvoju adresu.
- **Rezultat:** Probni mejl stiže u inbox, ne u spam.
- **Napomena:** DNS izmene ponekad traju i nekoliko sati. Dok domen nije potvrđen u Resend-u, mejlovi ne idu nikome osim tebi.

### Korak 2.15: Email rezime

- **Opis:** Automatski dnevni, nedeljni i mesečni rezime brojki na mejl tima.
- **Zadaci:**
  - HTML šablon u brend bojama: prihod, porudžbine, AOV, profit, top 3 proizvoda.
  - `app/api/cron/digest-daily/route.ts`, `digest-weekly`, `digest-monthly` (provera `CRON_SECRET`).
  - `vercel.json`: `0 7 * * *` (dnevno), `0 7 * * 1` (ponedeljkom), `0 7 1 * *` (prvog u mesecu).
  - Lista primalaca u `settings`.
- **Rezultat:** Tim dobija rezime po rasporedu.
- **Napomena:** `0 7` po UTC je 8h zimi, a 9h leti u Beogradu. Na Hobby planu cron može da okine bilo kad u tom satu.

### Korak 2.16: Bezbednosna provera

- **Opis:** Prolazimo kroz svaku rutu i proveravamo da niko ne može više nego što treba.
- **Zadaci:**
  - Spisak svih API ruta i za svaku: ko sme da je pozove (javna sa potpisom, cron sa tajnom, prijavljen, uloga).
  - `requireRole` na svakoj ruti koja menja podatke.
  - Provera da nijedan odgovor ne vraća ključeve prodavnica.
  - Provera RLS-a: odjavljen korisnik ne čita nijednu tabelu.
- **Rezultat:** Popunjen spisak ruta sa zaštitom; nijedna ruta ne radi više nego što sme.
- **Napomena:** Zaštita u `proxy.ts` nije dovoljna za API rute koje menjaju podatke. Uvek proveri ulogu i unutar same rute.

### Korak 2.17: Brzina i sitne greške

- **Opis:** Ubrzavanje aplikacije i čišćenje poznatih grešaka.
- **Zadaci:**
  - Recharts učitan samo na stranicama sa graficima.
  - Podešavanje SWR keša (da se isti podaci ne traže dva puta).
  - Provera upita bez indeksa (Supabase, Query Performance).
  - Popraviti upozorenja iz konzole browsera.
- **Rezultat:** Dashboard se otvara za manje od 2 sekunde; konzola je čista.
- **Napomena:** Nema posebne zamke.

### Korak 2.18: Testiranje i puštanje timu

- **Opis:** Završna provera na stvarnim uređajima i uvođenje tima.
- **Zadaci:**
  - Test na računaru, telefonu i TV-u.
  - Test celog toka: porudžbina u shopu, zvuk, feed, KPI, mejl sledećeg jutra.
  - Pozivi članovima tima preko Clerk-a, kratak obilazak aplikacije.
  - Odluka o planovima: za stvarnu upotrebu u firmi Vercel Pro; Supabase Pro ako baza pređe besplatna ograničenja.
- **Rezultat:** Tim koristi Orderly svakog dana.
- **Napomena:** Vercel Hobby je samo za ličnu, nekomercijalnu upotrebu. Pre nego što tim počne da radi u aplikaciji, prebaci projekat na Pro.

---

## Definicija gotovog po fazama

- **Faza 0:** Aplikacija je na Vercel adresi, prijava i uloge rade, 9 tabela sa RLS-om postoji, Clerk i Supabase su povezani, meni radi.
- **Faza 1:** Porudžbine sa WooCommerce-a (i Thinkific-a ako plan dozvoljava) ulaze same i preko sync-a; dashboard uživo prikazuje KPI, feed, tabelu sa filterima, osnovnu valutu i zvuk; dnevni sync radi.
- **Faza 2:** Analitika, sajt-dashboard, profit, kupci, pretplate (ako postoje), cilj, prognoza, kohorte, TV prikaz i email rezime rade; bezbednost proverena; tim koristi aplikaciju.

---

## Mapa stranica i ruta

**Stranice (sve traže prijavu):**

| Stranica | Sadržaj |
| --- | --- |
| `/sign-in`, `/sign-up` | Prijava i registracija (javne) |
| `/dashboard` | KPI, cilj, live feed, tabela porudžbina |
| `/dashboard/[siteId]` | Dashboard jednog sajta |
| `/analytics` | Prihod, statusi, poređenje, top proizvodi, prognoza, kohorte |
| `/customers` | Lista kupaca |
| `/customers/[id]` | Profil kupca |
| `/subscriptions` | MRR i churn |
| `/profit` | Bruto, neto, marža |
| `/profit/products` | Troškovi po proizvodu |
| `/settings/general` | Valuta, kursevi, cilj, statusi, primaoci mejla |
| `/settings/sites` | Prodavnice i sync |
| `/settings/sound` | Zvukovi po sajtu |
| `/tv` | TV prikaz (viewer nalog) |

**API rute:**

| Ruta | Zaštita |
| --- | --- |
| `/api/sites`, `/api/sites/[id]` | Prijava; izmene samo admin |
| `/api/settings` | Prijava; izmene samo admin |
| `/api/stats/kpi`, `/api/stats/sparklines` | Prijava |
| `/api/analytics/daily-revenue`, `status-breakdown`, `top-products`, `forecast`, `cohort` | Prijava |
| `/api/customers`, `/api/customers/[id]` | Prijava |
| `/api/subscriptions` | Prijava |
| `/api/profit/kpi`, `/api/profit/products` | Prijava; izmene admin i manager |
| `/api/profit/recalculate` | Samo admin |
| `/api/sound-settings`, `/api/sound-settings/upload` | Prijava; izmene samo admin |
| `/api/sync/all`, `/api/sync/woo/[siteId]`, `/api/sync/thinkific/[siteId]` | Admin i manager |
| `/api/webhook/woo/[siteId]`, `/api/webhook/thinkific/[siteId]` | Javne, provera potpisa |
| `/api/cron/daily-sync`, `/api/cron/digest-daily`, `digest-weekly`, `digest-monthly` | Javne, provera `CRON_SECRET` |

---

## Dizajn sistem

**Boje (`:root` u `globals.css`):**

| Token | Vrednost | Upotreba |
| --- | --- | --- |
| `--brand-accent` | `#1B6EF3` | Glavna boja, dugmad, linkovi |
| `--brand-accent-hover` | `#1558CC` | Prelaz mišem |
| `--brand-accent-bg` | `#EBF2FF` | Svetla pozadina akcenta |
| `--success` | `#16A34A` | Rast, završene porudžbine |
| `--warning` | `#D97706` | Na čekanju |
| `--danger` | `#DC2626` | Pad, otkazano |
| `--neutral` | `#6366F1` | Neutralne oznake |

Svaka boja ima i `-bg` svetlu varijantu za pozadinu oznaka. Tamna tema se definiše u `.dark`.

**Tipografija (Geist):**

| Element | Veličina / debljina | Razmak slova |
| --- | --- | --- |
| KPI broj | 28 do 32px / 700 | -0.03em |
| H1 | 24px / 700 | -0.02em |
| Naslov kartice | 13px / 600 | normalno |
| Tekst | 13px / 400 | normalno |
| Oznake (velika slova) | 11px / 500 | +0.04em |
| TV KPI broj | 64px / 700 | -0.03em |

**Senke:** `--shadow-sm` (kartica), `--shadow-md` (prelaz mišem), `--shadow-lg` (prozori).

**Animacije:**

- `--transition`: 180ms, `cubic-bezier(0.4, 0, 0.2, 1)` za prelaze mišem.
- `--transition-spring`: 300ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` za trake napretka i cilj.
- Kartica na prelaz mišem: pomeranje 1px nagore + `--shadow-md`.
- Dugme na klik: `scale(0.98)`.
- Nova porudžbina: klizanje odozgo, pojavljivanje i bljesak u akcent boji.
- TV: `tv-fade-in`, `tv-marquee`, `tv-row-in`.

---

## Česte greške i rešenja

| Problem | Rešenje |
| --- | --- |
| `node` ili `git` „ne postoji" u terminalu | Zatvori i ponovo otvori terminal posle instalacije. |
| AI piše kod za stariji Next.js | Pravilo u `CLAUDE.md` da se čita dokumentacija iz `node_modules/next/dist/docs/`; `proxy.ts` umesto `middleware.ts`. |
| Font Geist se ne primenjuje | Konfiguracija u `globals.css`; na `<body>` ide `geist.className`. |
| Clerk greška na stranici prijave | Stranica mora biti `sign-in/[[...sign-in]]/page.tsx`. |
| Webhook ne upisuje ništa, bez greške | Webhook ruta nije javna u `proxy.ts` ili je testiran na `localhost`. |
| WooCommerce sam isključi webhook | Ruta ne odgovara 200 na probni „ping" pri pravljenju webhook-a. |
| Thinkific potpis uvek neispravan | Thinkific šalje hex, WooCommerce base64; proveri format. |
| Stare porudžbine imaju današnji datum | `created_at` iz datuma porudžbine (`date_created_gmt`), nikad trenutno vreme. |
| Porudžbine posle ponoći na pogrešnom danu | Koristi `_gmt` datume i računaj „danas" po zoni Europe/Belgrade. |
| Real-time događaji ne stižu | Clerk i Supabase nisu povezani (korak 0.10); ne rešavati javnim `anon` pravilom. |
| Real-time veza se stalno zatvara i otvara | Browser Supabase klijent mora biti napravljen jednom, van komponente. |
| Feed zamrzne na neaktivnoj kartici ili TV-u | Ponovno učitavanje na povratak fokusa + provera veze na 30 s. |
| Feed prikazuje stare „duhove" | Bez `sessionStorage`; uvek sveže iz baze pri otvaranju. |
| Build puca zbog `useSearchParams` | Umotaj komponentu u `<Suspense>`. |
| Nema zvuka | Browser traži prvi klik; pozovi `unlockAudio()` na prvi klik. |
| Ukupna potrošnja kupca raste duplo | Računaj iz zbira porudžbina, ne dodavanjem. |
| AOV ne odgovara stvarnosti | Prihod / broj porudžbina, sa istim periodom i istim statusima u oba. |
| Sync puca na velikoj istoriji | Radi u delovima („nastavi od stranice X"). |
| Env izmena na Vercel-u ne radi | Posle izmene uradi Redeploy. |
| Cron pada pri objavljivanju | Hobby plan dozvoljava samo jednom dnevno. |
| Supabase projekat pauziran | Resume u dashboard-u; dnevni cron (1.21) ga drži aktivnim. |
| Ključevi prodavnica vidljivi u browseru | API za sajtove ne sme da vraća ključeve. |

---

## Napomene o zavisnostima

- **0.2** zavisi od **0.1**; svi kasniji koraci zavise od **0.2**.
- **0.4** zavisi od **0.3** (komponente koriste brend tokene).
- **0.6 i 0.7** zavise od **0.5**.
- **0.10** zavisi od **0.7** (RLS za `authenticated`), **0.8** i **0.9** (Clerk postoji).
- **0.11** zavisi od **0.8** i **0.10** (sve env varijable postoje).
- **0.12** zavisi od **0.4** i **0.8**.
- **1.1** zavisi od **0.9** (uloge) i **0.10** (admin klijent).
- **1.3 i 1.4** zavise od **0.6**; **1.5** od **1.1, 1.3 i 1.4**; **1.6** od **1.2, 1.5 i 0.11** (Vercel adresa).
- **1.7** zavisi od **1.3 i 1.4**; **1.8** od **1.7**.
- **1.9 i 1.10** zavise od **1.4** i od Thinkific plana sa API-jem.
- **1.11** mora biti gotov pre **1.14** (KPI računa u osnovnoj valuti).
- **1.12** zavisi od **0.10**; **1.13** od **1.12**.
- **1.14** zavisi od **1.11**; **1.15** od **1.13 i 1.14**.
- **1.16, 1.17 i 1.19** zavise od **1.13**; **1.18** od **1.17**; **1.20** od **1.19**.
- **1.21** zavisi od **1.7** (i **1.9** ako Thinkific radi).
- **2.1, 2.2, 2.6, 2.11 i 2.12** zavise od **1.11** i **1.14**; **2.11** dodaje liniju na grafik iz **2.1**.
- **2.3** zavisi od **1.15 do 1.18**.
- **2.5** zavisi od **2.4**.
- **2.8** zavisi od **2.7**.
- **2.13** zavisi od **1.15, 1.16 i 1.19**.
- **2.15** zavisi od **2.14** i **1.14**.
- **2.16 do 2.18** idu poslednji; zavise od svih prethodnih koraka.