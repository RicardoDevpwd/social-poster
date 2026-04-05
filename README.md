# Como rodar o projeto Social Poster

## Pré-requisitos
- Python 3.11+
- Node.js 18+

---

## Backend (Django)

```powershell
cd social-poster\backend

# Criar e ativar virtualenv
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt

# Copiar e configurar variáveis de ambiente
copy env.example .env
# Edite o arquivo .env com suas credenciais

# Criar banco e superusuário
python manage.py migrate
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

## Frontend (React + Vite)

```powershell
cd social-poster\frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

---

## Credenciais necessárias por plataforma

### Instagram
- `access_token`: User Access Token com permissão `instagram_content_publish`
- `extra_data`: `{"ig_user_id": "SEU_INSTAGRAM_USER_ID"}`

### Twitter / X
- `access_token`: OAuth 1.0a Access Token
- `token_secret`: Access Token Secret
- `extra_data`: `{"api_key": "...", "api_secret": "..."}`

### Facebook
- `access_token`: Page Access Token
- `extra_data`: `{"page_id": "SEU_PAGE_ID"}`

### LinkedIn
- `access_token`: OAuth 2.0 Access Token
- `extra_data`: `{"person_urn": "urn:li:person:XXXX"}`

### TikTok
- `access_token`: Access Token com escopo `video.upload`

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/register/ | Criar conta |
| POST | /api/auth/login/ | Login (retorna JWT) |
| POST | /api/auth/refresh/ | Renovar token |
| GET | /api/auth/me/ | Dados do usuário |
| GET/POST | /api/social/accounts/ | Listar/criar contas sociais |
| DELETE | /api/social/accounts/{id}/ | Remover conta social |
| GET/POST | /api/posts/ | Listar/criar posts |
| DELETE | /api/posts/{id}/ | Cancelar post |
| POST | /api/posts/{id}/publish/ | Publicar imediatamente |
