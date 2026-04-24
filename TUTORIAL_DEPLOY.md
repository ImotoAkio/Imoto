# Tutorial de Deploy - Arquivo Imoto

Este guia detalha como realizar o deploy e as atualizações do sistema na sua VPS utilizando Docker Swarm e SQLite.

## Pré-requisitos
1. Acesso SSH à sua VPS.
2. Docker e Docker Swarm ativos na VPS.
3. Rede `echonet` já criada.

---

## 🚀 Primeira Inicialização (Setup Inicial)

Se você está subindo o sistema pela primeira vez na VPS:

### Passo 1: Preparar os arquivos
No diretório do projeto na VPS (`~/projetos/Imoto`):
```bash
git pull origin main
```

### Passo 2: Construir a imagem Docker
```bash
docker build -t imoto-app:latest .
```

### Passo 3: Subir o Stack
```bash
docker stack deploy -c docker-stack.yml imoto
```

### Passo 4: Criar as tabelas do Banco de Dados
Como o projeto está em estágio inicial e não possui histórico de migrações, usamos o `db push`:
1. Descubra o ID do container: `docker ps | grep imoto_app`
2. Execute:
```bash
docker exec -it <ID_DO_CONTAINER> npx prisma db push
```

### Passo 5: Popular o banco (Opcional)
Se desejar carregar os dados de exemplo (membros e histórias):
```bash
docker exec -it <ID_DO_CONTAINER> npx tsx prisma/seed_imoto.ts
```

---

## 🔄 Fluxo de Atualização (Deploy Contínuo)

Sempre que você fizer alterações no código local e der um `git push`, siga estes passos na VPS para atualizar o site:

1. **Puxar o novo código:**
   ```bash
   git pull origin main
   ```

2. **Reconstruir a imagem:**
   ```bash
   docker build -t imoto-app:latest .
   ```

3. **Forçar o Swarm a usar a nova imagem:**
   ```bash
   docker service update --image imoto-app:latest imoto_app --force
   ```

4. **Sincronizar Schema (se alterou o prisma/schema.prisma):**
   ```bash
   docker exec -it $(docker ps -q -f name=imoto_app) npx prisma db push
   ```

---

## ⚠️ Lições Aprendidas e Dicas Técnicas

### 1. Compatibilidade Express 5
A rota coringa no `server/index.ts` deve ser definida como `app.get('*path', ...)` em vez de apenas `*`. O Express 5 utiliza uma versão mais rigorosa do `path-to-regexp` que exige nomes para parâmetros variáveis.

### 2. Prisma no Alpine Linux
Para o Prisma rodar em imagens Alpine (como a nossa), o `Dockerfile` **precisa** incluir a biblioteca `libc6-compat`. Já está configurado no Dockerfile atual, mas evite removê-la.

### 3. Persistência
Os dados estão seguros nos volumes:
- `imoto_db_data`: Armazena o banco SQLite (`/app/data/imoto.db`).
- `imoto_uploads`: Armazena as fotos enviadas (`/app/public/uploads`).

### 4. Logs de Erro
Se o container estiver reiniciando (loop), use este comando para ver o motivo real do erro:
```bash
docker service logs imoto_app --tail 50 -f
```

---

## Acesso
- **URL**: `https://imoto.echo.dev.br`
- **Ambiente**: Produção (Traefik + SSL automático)
