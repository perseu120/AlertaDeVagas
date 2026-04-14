# 🚀 Better Auth Boilerplate

📄 Documentação oficial:  
https://better-auth.com/docs/installation


## 📦 Instalação

Clone o projeto e instale as dependências:

```bash
npm install

# .env
DATABASE_URL="postgresql://admin:admin@localhost:5433/nextauth_db"

### Better Auth config
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000

#Google credencials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


npx prisma generate

Npx @better-auth/cli generate

npx prisma migrate reset
npx migrate dev
 -> Create-tables 


npm run dev