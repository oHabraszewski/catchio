zestaw komend początkującego proramisty: 

aby skopiować na lokala całe repo
``` git clone adres_repozytorium <- pobiera repo do folderu z nazwą owego repo ```

aby wysłać swoje zmainay na repo, to po kolei:
``` git add . <- (bardzo ważna kropka nie zapomnijcie) dodaje wszystko na "scene" (koncept gita) nie trzeba się tym przejmować ``` \n
``` git commit -m "wiadomość" <- powiedzenie git ze checmy coś zmenić, wiadomość to krótka notka na temat co zrobiliście ``` \n
``` git push <- (z ang push => pchać) wysyłacie finalnie swoje zmiany na repo ``` \n

aby pobrać nowe zmany z repo
``` git pull <- z ang pull ciągnąć ```


aby uruchomić projekt
``` kopiujemy repo na lokala ``` \n
``` wchodzimy terminalem do folderu repo ``` \n
``` npm i <- (i od install) instlujemy wymagane paczki z package.json ``` \n
``` gulp <- odpalamy projekt w trybie nasłuchiwania (gdy zostanie wprowadzona zmiana do plikow w folderze app projekt zrobi rebuilda) ``` \n

po ostatnim kroku powinna się otworzyć przeglądarka z adresem: "localhost:8080"



częste problemy 

podczas git push, jeśli ktoś był szybszy od was i wysłał swoje zmiany wcześniej a wy ich jeszcze nie macie
rozwiązanie
podążanie za instrukcjami gita

podczas wykonywania polecenia npm i terminal wywali że nie ma takiego polecenia
rozwiązanie
udać się na strone: https://nodejs.org, pobrać i zainstalować

podczas komendy gulp wywali że nie ma takiego polecenia albo inny błąd
rozwiązanie
upewnić sie że `npm i` zostało wykonane jeśli nie zadziała to wykonać komendę `npm i -g gulp`


jeśli te rozwiązania nie pomogły proszę zgłaszać się do Wiktora lub Oskara