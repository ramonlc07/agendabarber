# AgendaBarber
## AgendaBarber

Sou o autor deste projeto acadêmico, desenvolvido para gerenciar agendamentos de uma barbearia de forma simples e didática.

### Visão geral
AgendaBarber é uma aplicação minimalista composta por um backend em Node.js que expõe rotas básicas para gerenciamento de agendamentos, profissionais, clientes e bloqueios, e um frontend em HTML/CSS/JS com Bootstrap para interação do usuário.

### Funcionalidades principais
- Gerenciamento de agendamentos
- Cadastro e autenticação de clientes e profissionais
- Bloqueio de horários
- Interface simples para administrador e cliente

### Tecnologias
- Node.js + Express
- SQLite
- HTML, Bootstrap, SASS, JavaScript (sem frameworks)

### Requisitos
- Node.js (versão 14 ou superior)
- npm

### Instalação
1. No diretório do projeto, instale as dependências:

```bash
npm install
```

2. O projeto usa SQLite. Se o arquivo `barbearia.db` não existir, a aplicação inicializa a base conforme `backend/initDB.js`.

### Execução
- Para iniciar o servidor backend:

```bash
node backend/server.js
```

- Para testar o frontend localmente, abra `frontend/index.html` ou execute o servidor estático:

```bash
node frontend/server.js
```

### Estrutura do repositório
- `backend/`: código do servidor, controladores, rotas e inicialização do banco
- `frontend/`: páginas HTML, CSS (SASS) e scripts do cliente
- `barbearia.db`: arquivo SQLite (quando presente)

### Como contribuir
1. Crie uma branch com a sua alteração: `git checkout -b minha-melhoria`
2. Faça commits concisos e descritivos
3. Abra um Pull Request descrevendo as mudanças

### Contato
Se precisar, abra uma issue ou entre em contato pelo perfil do GitHub.

### Licença
Projeto desenvolvido para fins acadêmicos; sem licença explícita.

---
Versão refinada do `README.md` com tom profissional em primeira pessoa.
É um sistema de agendemantos voltado para procedimentos de barbearia.
