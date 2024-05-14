<p align="center">Petopiya REST API</p>

## Description

Petopiya Market is your ultimate online destination for all things pet-related. From adopting a new furry friend to shopping for quality pet products and accessing valuable pet care resources, everything is conveniently available in one place.

## Services

- **user**
- **auth**
- **vendor**
- **bucket**
- **blogging**
- **product**
- **order**

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [node.js](https://nodejs.org/en/)
- Install [pnpm](https://pnpm.io/installation)
- Install [mongo-db](https://www.mongodb.com/try/download/community)
- Install [vs-code](https://code.visualstudio.com/)
- S3 bucket for storing Images.

# Getting started

- Clone the repository

```bash
git clone https://github.com/aashishpanchal/petopiy-backend <project_name>
```

- Install dependencies

```bash
cd project_name
pnpm install
cd project_name/packages/logger
pnpm build
```

- Configure your MongoDB server
  create a database (dev).
  Enter Your credentials into .env file.

# Env config

```env
PORT=8000
NAME="Petopiya"
HOST="127.0.0.1"
NODE_ENV="development"
SECRET="tO0/+VsshTF2uFelCE1RjvtXY="

# database
DATABASE_URL="mongodb://localhost:27017/petopiya?retryWrites=true&w=majority"

# jwt
JWT_ACCESS_EXP="15m"
JWT_REFRESH_EXP="1d"

# smtp
SMTP_PORT=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# s3 bucket
S3_BUCKET=
S3_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```
