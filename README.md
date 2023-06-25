# Ciobanu_Victor_Aplicație_Practică_Informatică_Licență

Adresa repository-ului: https://github.com/victorcb00/FaceAccess.git

# FaceAccess

Pașii de compilare a aplicației FaceAcess:
1. Se deschide proiectul din directorul „FaceAccess” în mediul de dezvoltare integrat
2. Se deschide terminalul aferent mediului de dezvoltare
3. Se rulează comanda: 
    npm run build
4. Se încarcă fișierele pe serverul web sau se poate rula local, rulând comenzile:
    npm install -g serve
    serve -s build

# Server

Pașii de compilare a programului de server:
1. Se deschide proiectul din directorul „Server” în mediul de dezvoltare integrat
2. Se deschide terminalul aferent mediului de dezvoltare
3. Se rulează comenzile:
    pip install pyinstaller
    pyinstaller --onefile program_principal.py
4. Executabilul va fi creat la adresa specificată în terminal
5. Se deschide aplicația, rulând executabilul


