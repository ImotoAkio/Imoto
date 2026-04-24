# Tutorial de Deploy - Arquivo Imoto

Este guia detalha como realizar o deploy do sistema na sua VPS utilizando Docker Swarm e SQLite.

## Pré-requisitos
1. Acesso SSH à sua VPS.
2. Docker e Docker Swarm ativos na VPS.
3. Rede `echonet` já criada (confirmado no seu relatório).

---

## Passo 1: Preparar os arquivos na VPS
Você precisa levar o código do projeto para a VPS. Você pode fazer isso via `git clone` ou enviando os arquivos via SCP/FTP.

Certifique-se de que os seguintes arquivos estão na raiz do projeto na VPS:
- `Dockerfile`
- `docker-stack.yml`
- `package.json`
- `prisma/` (pasta com o schema)
- `server/` (pasta com o código do backend)
- `src/` (pasta com o código do frontend)
- `public/` (pasta de arquivos estáticos)

---

## Passo 2: Construir a imagem Docker
Na raiz do projeto na VPS, execute o comando para construir a imagem:

```bash
docker build -t imoto-app:latest .
```
*Este comando vai compilar o frontend, instalar as dependências e preparar o ambiente de produção.*

---

## Passo 3: Realizar o Deploy do Stack
Agora, vamos subir o serviço no Swarm:

```bash
docker stack deploy -c docker-stack.yml imoto
```

---

## Passo 4: Inicializar o Banco de Dados (Primeira vez)
Como estamos usando SQLite, o arquivo do banco será criado automaticamente dentro do volume persistente. Precisamos rodar as migrações para criar as tabelas:

1. Descubra o ID ou nome do container rodando:
   ```bash
   docker ps | grep imoto_app
   ```

2. Execute as migrações dentro do container:
   ```bash
   docker exec -it <ID_DO_CONTAINER> npm run prisma:migrate
   ```

---

## Passo 5: Popular o banco (Opcional)
Se você quiser importar os dados iniciais que temos no projeto:

```bash
docker exec -it <ID_DO_CONTAINER> npx tsx prisma/seed_imoto.ts
```

---

## Informações Importantes

### 1. Persistência de Dados
Os dados do banco e as imagens enviadas estão seguros em volumes do Docker:
- **Banco de Dados**: Volume `imoto_db_data` (mapeado para `/app/data` no container).
- **Uploads**: Volume `imoto_uploads` (mapeado para `/app/public/uploads` no container).

Mesmo que o container seja reiniciado ou atualizado, os dados **não serão perdidos**.

### 2. Acesso
O sistema estará disponível em: `https://imoto.echo.dev.br`
O Traefik cuidará automaticamente do certificado SSL (HTTPS).

### 3. Atualizações Futuras
Sempre que você alterar o código:
1. Faça o `git pull` na VPS.
2. Rode o `docker build` novamente.
3. Rode `docker service update --image imoto-app:latest imoto_app --force` para atualizar o serviço.

---

## Solução de Problemas
Se o site não abrir:
- Verifique os logs do container: `docker service logs -f imoto_app`
- Verifique se o Traefik está capturando o serviço: `docker service inspect imoto_app`
