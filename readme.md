# zestaw komend początkującego proramisty: 

## aby skopiować na lokala całe repo
>1. git clone adres_repozytorium <- pobiera repo do folderu z nazwą owego repo 

## aby wysłać swoje zmainay na repo, to po kolei:
>1. git add . <- (bardzo ważna kropka nie zapomnijcie) dodaje wszystko na "scene" (koncept gita) nie trzeba się tym przejmować  
>2. git commit -m "wiadomość" <- powiedzenie git ze checmy coś zmenić, wiadomość to krótka notka na temat co zrobiliście  
>3. git push <- (z ang push => pchać) wysyłacie finalnie swoje zmiany na repo  

## aby pobrać nowe zmany z repo
>1. git pull <- z ang pull ciągnąć 


## aby uruchomić projekt
>1. kopiujemy repo na lokala  
>2. wchodzimy terminalem do folderu repo  
>3. npm i <- (i od install) instlujemy wymagane paczki z package.json  
>4. gulp <- odpalamy projekt w trybie nasłuchiwania (gdy zostanie wprowadzona zmiana do plikow w folderze app projekt zrobi rebuilda)

po ostatnim kroku powinna się otworzyć przeglądarka z adresem: "localhost:8080"



## częste problemy 

podczas git push, jeśli ktoś był szybszy od was i wysłał swoje zmiany wcześniej a wy ich jeszcze nie macie
rozwiązanie
podążanie za instrukcjami gita

podczas wykonywania polecenia npm i terminal wywali że nie ma takiego polecenia
rozwiązanie
udać się na strone: https://nodejs.org, pobrać i zainstalować

podczas komendy gulp wywali że nie ma takiego polecenia albo inny błąd
rozwiązanie
upewnić sie że npm i zostało wykonane jeśli nie zadziała to wykonać komendę npm i -g gulp


jeśli te rozwiązania nie pomogły proszę zgłaszać się do Wiktora lub Oskara