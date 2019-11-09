# Zestaw komend początkującego programisty: 

## Kopiowanie repozytorium z chmury na swój komputer
>1. git clone *adres_repozytorium* <- Kopiuje repozytorium z chmury na komputer.

## Zapisanie swoich zmian w repozytorium
>1. git add * <- Dodaje do kolejki zmian, **jeszcze nie jest w repozytorium**
>2. git commit -m "*Message*" <- Dodaje nasze zmiany z kolejki (up) do repozytorium. "Message" to krótki opis zmian, w celu łatwiejszej identyfikacji.

## Wysyłanie zmian na chmurę (Github)
>1. git push <- (ang. push - pchać) Wysyła zmiany na chmurę Githuba.

## Pobieranie zmian z chmury (Github)
>1. git pull <- (ang. pull - ciągnąć) Pobiera nowe zmiany z chmury Githuba.


## Uruchamianie projektu
>1. Uruchamiamy Wiersz poleceń/Terminal/CMD.
>2. Przechodzimy w Terminalu do lokalizacji naszego projektu (komenda cd).
>3. npm i <- (i od install) Instaluje wymagane biblioteki z pliku package.json.
>4. gulp <- Odpala projekt. Jeśli wprowadzimy zmiany, automatycznie się zrestartuje.

Po ostatnim kroku otworzy się przeglądarka z adresem: "localhost:5343"



## Częste problemy 

Podczas git push, jeśli wysłał swoje zmiany wcześniej, a Wy ich jeszcze nie macie.

Rozwiązanie:
Podążanie za instrukcjami gita

Podczas wykonywania polecenia *npm i* Terminal twierdzi, że nie ma takiego polecenia.
Rozwiązanie:
Udać się na stronę: https://nodejs.org, pobrać i zainstalować.

Podczas komendy *gulp* Terminal twierdzi, że nie ma takiego polecenia, bądź inny błąd.
Rozwiązanie
Upewnić się, że *npm i* zostało wykonane. Jeśli nie zadziała, wykonać komendę *npm i -g gulp*.


Jeśli te rozwiązania nie pomogą, proszę zgłaszać się do Wiktora lub Oskara.