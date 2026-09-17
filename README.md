# 🎯 Czółko – gra ze znajomymi

Prosta aplikacja webowa do gry w Czółko. Każdy gracz otwiera ten sam link
na swoim telefonie, wpisuje nick, a gdy wszyscy są gotowi – dowolna osoba
klika "Start". Wtedy każdy dostaje na swój telefon **inne, losowe hasło**,
które ma odgadnąć (trzyma telefon ekranem na zewnątrz, np. na czole,
a reszta podpowiada).

## Funkcje

- Dołączanie do gry przez nick (bez rejestracji).
- Wspólna poczekalnia widoczna na żywo u wszystkich graczy.
- Start gry przez dowolnego gracza (min. 2 osoby).
- Losowe hasła, indywidualne dla każdego gracza.
- Przycisk "Następne hasło" – gdy ktoś odgadnie swoje hasło, dostaje kolejne.
- Tryb pełnego ekranu (przydatny, gdy trzyma się telefon na czole).
- Przycisk "Zakończ grę" – kończy rundę dla wszystkich i wraca do poczekalni.

## Uruchomienie lokalne

Wymagany [Node.js](https://nodejs.org) w wersji 18+.

```bash
npm install
npm start
```

Aplikacja wystartuje domyślnie na `http://localhost:3000`.
Żeby zagrać ze znajomymi w tej samej sieci Wi-Fi, podaj im adres IP
Twojego komputera, np. `http://192.168.1.10:3000`.

## Własna lista haseł

Wszystkie hasła znajdują się w pliku `words.js`. Możesz dowolnie
dopisywać, usuwać i zmieniać wpisy – wystarczy zachować format:

```js
module.exports = [
  "pies",
  "kot",
  "Twoje własne hasło",
  // ...
];
```

## Wystawienie gry w internecie (żeby link działał dla wszystkich)

Kod jest gotowy do wrzucenia na GitHub i wdrożenia za darmo, np. na
[Render.com](https://render.com):

1. Załóż nowe, puste repozytorium na GitHubie (np. `czolko-game`).
2. W folderze projektu wykonaj:
   ```bash
   git remote add origin https://github.com/TWOJA_NAZWA/czolko-game.git
   git branch -M main
   git push -u origin main
   ```
3. Wejdź na [render.com](https://render.com) → **New +** → **Web Service**.
4. Połącz swoje konto GitHub i wybierz repozytorium `czolko-game`.
5. Ustawienia:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Plan: **Free**
6. Kliknij **Create Web Service** – po chwili dostaniesz publiczny link
   (np. `https://czolko-game.onrender.com`), który możesz wysłać znajomym.

Alternatywy: [Railway.app](https://railway.app), [Fly.io](https://fly.io)
lub [Glitch.com](https://glitch.com) – działają na bardzo podobnej zasadzie.

> Uwaga: darmowe plany na Render mogą "usypiać" aplikację po dłuższej
> nieaktywności – pierwsze wejście po dłuższej przerwie może potrwać
> kilkanaście sekund, zanim serwer się obudzi.

## Struktura projektu

```
czolko-game/
├── server.js         # backend (Express + Socket.io)
├── words.js          # lista haseł – edytuj tu!
├── package.json
├── public/
│   ├── index.html    # 3 ekrany: nick / poczekalnia / gra
│   ├── style.css
│   └── app.js         # logika frontendu i komunikacja z serwerem
└── README.md
```
