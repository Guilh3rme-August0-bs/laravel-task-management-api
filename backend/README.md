# Task Management CRUD API

![Laravel](https://img.shields.io/badge/laravel-red?style=for-the-badge&logo=laravel&logoColor=white)

API RESTful para gerenciamento de tarefas com autenticação OAuth2 via Laravel Passport.

## Autenticação

### POST /api/login

Autentica o usuário e retorna um token de acesso OAuth2 (Password Grant Type).
O token deve ser incluído no header `Authorization: Bearer {token}` em todas as requisições protegidas.
Retorna os dados do usuário e o access token que expira conforme configuração do Passport.

```bash
curl --location --request POST 'http://localhost:8000/api/login' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--data-raw '{
    "email": "seu-email@example.com",
    "password": "sua-senha"
}'
```

**Resposta de Sucesso (200):**
```json
{
    "user": {
        "id": 1,
        "name": "Nome do Usuário",
        "email": "seu-email@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Resposta de Erro (401):**
```json
{
    "message": "Credenciais inválidas"
}
```

---

## Endpoints de Tarefas

Todos os endpoints abaixo requerem autenticação via Bearer Token.

### POST /api/tasks

Cria uma nova tarefa vinculada automaticamente ao usuário autenticado.
O campo `tarefa` deve ser único no sistema e aceita no máximo 50 caracteres.
Status aceitos: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`. Prioridades aceitas: `BAIXA`, `MEDIA`, `ALTA`.

```bash
curl --location --request POST 'http://localhost:8000/api/tasks' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json'
--header 'Authorization: Bearer {seu-token}' 
--data-raw '{
    "tarefa": "Implementar autenticação",
    "descricao": "Adicionar OAuth2 com Laravel Passport",
    "status": "PENDENTE",
    "prioridade": "ALTA"
}'
```

**Validações:**
- `tarefa`: obrigatório, string, máximo 50 caracteres, único
- `descricao`: opcional, string, máximo 255 caracteres
- `status`: obrigatório, valores aceitos: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`
- `prioridade`: obrigatório, valores aceitos: `BAIXA`, `MEDIA`, `ALTA`

**Resposta de Sucesso (200):**
```json
{
    "tarefa criada": {
        "id": 1,
        "tarefa": "Implementar autenticação",
        "descricao": "Adicionar OAuth2 com Laravel Passport",
        "status": "PENDENTE",
        "prioridade": "ALTA",
        "user_id": 1,
        "created_at": "2026-10-02T10:52:00.000000Z",
        "updated_at": "2026-10-02T10:52:00.000000Z"
    }
}
```

---

### GET /api/tasks

Lista todas as tarefas com paginação e informações do usuário relacionado.
Aceita o parâmetro `per_page` com valores: 10 (padrão), 20, 25, 50 ou 100 para controlar itens por página.
Retorna metadados de paginação (total, página atual, links) e inclui o relacionamento `user` em cada tarefa.

```bash
curl --location --request GET 'http://localhost:8000/api/tasks?per_page=20' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--header 'Authorization: Bearer {seu-token}'
```

**Parâmetros de Query:**
- `per_page` (opcional): 10, 20, 25, 50 ou 100. Padrão: 10

**Resposta (200):**
```json
{
    "tarefas:": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "tarefa": "Implementar autenticação",
                "descricao": "Adicionar OAuth2 com Laravel Passport",
                "status": "PENDENTE",
                "prioridade": "ALTA",
                "user_id": 1,
                "created_at": "2026-10-02T10:52:00.000000Z",
                "updated_at": "2026-10-02T10:52:00.000000Z",
                "user": {
                    "id": 1,
                    "name": "Nome do Usuário"
                }
            }
        ],
        "first_page_url": "http://localhost:8000/api/tasks?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8000/api/tasks?page=1",
        "links": [...],
        "next_page_url": null,
        "path": "http://localhost:8000/api/tasks",
        "per_page": 10,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```

---

### GET /api/tasks/{id}

Retorna os detalhes de uma tarefa específica incluindo informações do usuário criador.
Lança erro 404 se a tarefa não for encontrada.
Inclui o relacionamento `user` com id e nome do criador da tarefa.

```bash
curl --location --request GET 'http://localhost:8000/api/tasks/1' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--header 'Authorization: Bearer {seu-token}'
```

**Resposta de Sucesso (200):**
```json
{
    "tarefa selecionada:": {
        "id": 1,
        "tarefa": "Implementar autenticação",
        "descricao": "Adicionar OAuth2 com Laravel Passport",
        "status": "PENDENTE",
        "prioridade": "ALTA",
        "user_id": 1,
        "created_at": "2026-10-02T10:52:00.000000Z",
        "updated_at": "2026-10-02T10:52:00.000000Z",
        "user": {
            "id": 1,
            "name": "Nome do Usuário"
        }
    }
}
```

**Resposta de Erro (404):**
```json
{
    "message": "No query results for model [App\\Models\\Task] {id}"
}
```

---

### PUT /api/tasks/{id}

Atualiza todos os campos de uma tarefa existente.
O campo `tarefa` deve permanecer único, ignorando a própria tarefa sendo atualizada.
Todos os campos são obrigatórios (tarefa, descricao, status, prioridade) conforme regras de validação.

```bash
curl --location --request PUT 'http://localhost:8000/api/tasks/1' 
--header 'Content-Type: application/json' 
--header 'Accept: application/json' 
--header 'Authorization: Bearer {seu-token}' 
--data-raw '{
    "tarefa": "Implementar autenticação",
    "descricao": "OAuth2 implementado com sucesso",
    "status": "CONCLUIDA",
    "prioridade": "ALTA"
}'
```

**Validações:**
- `tarefa`: obrigatório, string, máximo 50 caracteres, único (exceto a própria tarefa)
- `descricao`: opcional, string, máximo 255 caracteres
- `status`: obrigatório, valores aceitos: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`
- `prioridade`: obrigatório, valores aceitos: `BAIXA`, `MEDIA`, `ALTA`

**Resposta de Sucesso (200):**
```json
{
    "tarefa atualizada": {
        "id": 1,
        "tarefa": "Implementar autenticação",
        "descricao": "OAuth2 implementado com sucesso",
        "status": "CONCLUIDA",
        "prioridade": "ALTA",
        "user_id": 1,
        "created_at": "2026-10-02T10:52:00.000000Z",
        "updated_at": "2026-10-02T11:00:00.000000Z",
        "user": {
            "id": 1,
            "name": "Nome do Usuário"
        }
    }
}
```

---

### DELETE /api/tasks/{id}

Exclui permanentemente uma tarefa do sistema (hard delete).
Retorna os dados da tarefa excluída na resposta.
Lança erro 404 se a tarefa não existir.

```bash
curl --location --request DELETE 'http://localhost:8000/api/tasks/1' 
--header 'Accept: application/json' 
--header 'Authorization: Bearer {seu-token}'
```

**Resposta de Sucesso (200):**
```json
{
    "tarefa excluída": {
        "id": 1,
        "tarefa": "Implementar autenticação",
        "descricao": "OAuth2 implementado com sucesso",
        "status": "CONCLUIDA",
        "prioridade": "ALTA",
        "user_id": 1,
        "created_at": "2026-10-02T10:52:00.000000Z",
        "updated_at": "2026-10-02T11:00:00.000000Z",
        "user": {
            "id": 1,
            "name": "Nome do Usuário"
        }
    }
}
```

**Resposta de Erro (404):**
```json
{
    "message": "No query results for model [App\\Models\\Task] {id}"
}
```

---

## Requisitos

- PHP 8.5+
- Laravel 11.x
- Laravel Passport
- Composer

## Instalação

```bash
# Instalar dependências
composer install

# Configurar arquivo .env
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Executar migrations
php artisan migrate

# Instalar Laravel Passport
php artisan passport:install

# Iniciar servidor
php artisan serve
```

## Observações

- Todas as rotas de tarefas (`/api/tasks`) são protegidas pelo middleware `auth:api`
- Os tokens OAuth2 são gerenciados pelo Laravel Passport
- As tarefas são automaticamente vinculadas ao usuário autenticado no momento da criação
- O relacionamento `user` retorna apenas `id` e `name` para otimização
