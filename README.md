# VESS API - Avaliação Visual da Estrutura do Solo

API REST para o aplicativo VESS desenvolvida com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 **Pré-requisitos**

- **Node.js** 16+
- **PostgreSQL** 12+
- **npm** ou **yarn**

## 📦 **Instalação Rápida**

```bash
# 1. Clone/crie o projeto
mkdir vess-api && cd vess-api

# 2. Instale as dependências
npm install

# 3. Configure o banco PostgreSQL
# Crie um banco chamado 'vess_db' no PostgreSQL

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 5. Execute as migrações
npx prisma migrate dev --name init

# 6. Gere o cliente Prisma
npx prisma generate

# 7. Execute o seed (dados iniciais)
npx prisma db seed

# 8. Inicie o servidor
npm run dev
```

## ⚙️ **Configuração do Banco**

### 1. **Criar banco PostgreSQL:**

```sql
CREATE DATABASE vess_db;
CREATE USER vess_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE vess_db TO vess_user;
```

### 2. **Configurar .env:**

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://vess_user:sua_senha@localhost:5432/vess_db?schema=public"
JWT_SECRET="gere-uma-chave-secreta-de-32-caracteres"
JWT_REFRESH_SECRET="gere-outra-chave-secreta-de-32-caracteres"
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🏃‍♂️ **Scripts Disponíveis**

```bash
# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Migrações do banco
npm run db:migrate

# Gerar cliente Prisma
npm run db:generate

# Executar seed
npm run db:seed

# Interface visual do banco
npm run db:studio

# Reset completo do banco
npm run db:reset
```

## 📡 **Endpoints da API**

### **🔐 Autenticação (`/api/auth`)**

| Método | Endpoint    | Descrição              |
| ------ | ----------- | ---------------------- |
| POST   | `/register` | Registrar novo usuário |
| POST   | `/login`    | Login                  |
| POST   | `/refresh`  | Renovar token          |
| POST   | `/logout`   | Logout                 |
| POST   | `/verify`   | Verificar token        |

### **👤 Usuários (`/api/users`)**

| Método | Endpoint   | Descrição               |
| ------ | ---------- | ----------------------- |
| GET    | `/profile` | Perfil do usuário       |
| PUT    | `/profile` | Atualizar perfil        |
| DELETE | `/account` | Deletar conta           |
| GET    | `/stats`   | Estatísticas do usuário |

### **📊 Avaliações (`/api/evaluations`)**

| Método | Endpoint | Descrição                   |
| ------ | -------- | --------------------------- |
| GET    | `/`      | Listar avaliações           |
| POST   | `/`      | Criar avaliação             |
| GET    | `/:id`   | Detalhes da avaliação       |
| PUT    | `/:id`   | Atualizar avaliação         |
| DELETE | `/:id`   | Deletar avaliação           |
| GET    | `/stats` | Estatísticas das avaliações |

## 🔧 **Exemplos de Uso**

### **1. Registro de usuário:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "name": "João Silva",
    "password": "123456",
    "cityState": "Pato Branco - PR"
  }'
```

### **2. Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456"
  }'
```

### **3. Criar avaliação:**

```bash
curl -X POST http://localhost:5000/api/evaluations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Avaliação Campo Sul",
    "date": "2024-01-20",
    "startTime": "08:00",
    "samples": [
      {
        "name": "Amostra 1",
        "location": "-26.2285, -52.6769",
        "layers": [
          {"length": 10, "score": 2, "order": 1},
          {"length": 15, "score": 3.5, "order": 2}
        ]
      }
    ]
  }'
```

## 📊 **Estrutura do Banco**

```sql
Users (usuários)
├── id (PK)
├── email (unique)
├── name
├── passwordHash
├── address
├── country
├── cityState
├── language
└── timestamps

Evaluations (avaliações)
├── id (PK)
├── userId (FK)
├── name
├── date
├── startTime
├── endTime
├── averageScore
├── managementDescription
└── timestamps

Samples (amostras)
├── id (PK)
├── evaluationId (FK)
├── name
├── location
├── otherInfo
├── managementDecision
├── sampleScore
└── timestamps

Layers (camadas)
├── id (PK)
├── sampleId (FK)
├── length
├── score
├── order
└── timestamps
```

## 🔒 **Segurança**

- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança
- **CORS** configurado
- **Validação** com Zod
- **Rate limiting** (implementar se necessário)

## 🐳 **Docker (Opcional)**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🌐 **Deploy**

### **Heroku:**

```bash
# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Executar migrações
heroku run npx prisma migrate deploy
```

## 📧 **Contato**

- **Coordenadora:** Profa. Dra. Rachel Muylaert Locks Guimarães
- **Email:** rachelguimaraes@utfpr.edu.br
- **Instituição:** UTFPR - Universidade Tecnológica Federal do Paraná

## 🧪 **Dados de Teste**

Após executar o seed:

- **Email:** demo@vess.com
- **Senha:** 123456

## ⚡ **Health Check**

```bash
curl http://localhost:5000/api/health
```

A API está funcionando quando retorna status 200! 🎉
