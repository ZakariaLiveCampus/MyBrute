# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


A FAIRE POUR CREER LA BASE DE DONNEES ET LANCER LE SERVEUR !

npm install -g nodemon

Sur PhpMyAdmin, créer une base de données vierge nommée "mybrutes" pour que ça fonctionne.

Lancer le serveur backend => cd MyBrute-Backend => nodemon app => Vérifier que ces messages apparaissent dans la console

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node app src/app.js`
Server running on port 3000
Database Connection Successfull!!
users table created or already exists
brutes table created or already exists
skills table created or already exists
brute_skills table created or already exists
weapons table created or already exists
brute_weapons table created or already exists
battles table created or already exists
All tables created successfully

COMMANDE A REALISER EGALEMENT => npm install axios --save