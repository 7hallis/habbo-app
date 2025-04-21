# Habbo BR - Visualizador de Perfis (Next.js)

Aplicação feita com **Next.js** e **React** para consultar **usuários do Habbo Hotel Brasil** (`habbo.com.br`) utilizando a API pública do jogo. O projeto permite buscar usuários e exibir dados do perfil conforme sua privacidade.

## 🧩 Funcionalidades

- 🔍 Busca de usuários por nickname
- 🇧🇷 Foco exclusivo no hotel brasileiro (`habbo.com.br`)
- 🛡️ Respeita perfis privados (mostra apenas **missão** e **status online/offline**)
- 📖 Exibe dados completos de perfis públicos:
  - Último acesso
  - Membro desde
  - Missão
  - Status (online/offline)
  - Nível atual
  - Emblema favorito
  - Quartos
  - Grupos
  - Amigos
  - Emblemas

## 🧪 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/) (opcional)
- [TypeScript](https://www.typescriptlang.org/) (opcional)
- [Vercel](https://vercel.com/) para deploy

## 🖼️ Interface

> Exemplo de como será a experiência:
```
🔎 [Buscar por nickname]

➡️ Se perfil for privado:
  - Missão: "Divirta-se com responsabilidade"
  - Status: Online ✅ / Offline ❌

➡️ Se perfil for público:
  - Último acesso: 09/03/2025, 01:07
  - Membro desde: 31/05/2013
  - Missão: "Eu amo o Habbo!"
  - Status: Online ✅ / Offline ❌
  - Nível: 22
  - Emblema Favorito: 🏅
  - Quartos: Lista com nome
  - Grupos: Nome + imagem
  - Amigos: Nicknames + avatar
  - Emblemas: Lista com imagem
```

## 🚀 Como rodar localmente

```bash
# Clonar repositório
git clone https://github.com/seunome/habbo-br-profile-viewer.git

# Entrar no projeto
cd habbo-app

# Instalar dependências
npm install

# Iniciar em modo dev
npm run dev

# Acessar em: http://localhost:3000
```

## 🌍 Deploy
Link do projeto online na Vercel : https://habbo-app.vercel.app 
<br>
Este projeto está pronto para **deploy na [Vercel](https://vercel.com/)**. Basta importar o repositório via GitHub e configurar como projeto Next.js.

## 🔒 API usada

As requisições são feitas diretamente à API pública do Habbo BR:

- Buscar usuário:  
  `https://www.habbo.com.br/api/public/users?name={nickname}`
- Perfil completo:  
  `https://www.habbo.com.br/api/public/users/{user_id}`

Outros endpoints usados:
- `/rooms`, `/badges`, `/friends`, `/groups`, `/achievements`

## 🤝 Contribuições

Contribuições são bem-vindas! Se quiser adicionar novas features, melhorar o layout ou performance, sinta-se à vontade para abrir uma PR.
