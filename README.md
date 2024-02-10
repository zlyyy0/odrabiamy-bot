# OdrabiamyBOT
Discordowy klient serwisu odrabiamy.pl

został stworzony na bazie:
 - [doteq/odrabiamy-bot](https://github.com/doteq/odrabiamy-bot)
 - [m1chaelbarry/odrabiamy-bot](https://github.com/m1chaelbarry/odrabiamy-bot)

## Konfiguracja BOT'a
Konfiguracja BOT'a znajduję się w pliku [`src/config.ts`](src/config.ts).
Powinna wyglądać tak:
```
export default {
    token: 'token-twojego-bota', // Discord BOT Token (znajdziesz go na tej stronie: https://discord.com/developers/applications/)
    channels: 'id-serwera', // Guild ID
    odrabiamyAuth: 'token-odrabiamy', // Odrabiamy.pl API v2 Auth token
    clientID: 'id-twojego-bota' // Client ID  (znajdziesz go na tej stronie: https://discord.com/developers/applications/)
}
```

# Uruchomienie BOT'a
```bash
$ npm install
$ npm run build
$ node ./dist/main.js
```
> Pamiętaj że po każdej zmianie w plikach bota należy wpisać ```npm run build```.

# Informacja
Po poprawnym skonfigurowaniu bota, powinny działać komendy (/) oraz bot powinien wysyłać zadania.
Jeżeli masz jakiś problem, skontaktuj się ze mną na Discordzie: ```zlyyy```

## Ostrzeżenie
Korzystanie z API serwisu odrabiamy.pl przez zewnętrzne programy jest możliwe wyłącznie za zgodą administracji. Użytkownik bierze na siebie całą odpowiedzialność przy korzystaniu z projektu.
