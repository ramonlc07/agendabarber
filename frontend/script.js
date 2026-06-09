const API_URL = '';

const formCadastro = document.getElementById('form-cadastro');
const formLogin = document.getElementById('form-login');
const formAgendamento = document.getElementById('form-agendamento');
const formServico = document.getElementById('form-servico');
const formProfissional = document.getElementById('form-profissional');
const formBloqueio = document.getElementById('form-bloqueio');
const btnSair = document.getElementById('btn-sair');
const btnLimparMeus = document.getElementById('btn-limpar-meus');
const btnLimparAgendamentos = document.getElementById('btn-limpar-agendamentos');
const btnLimparBloqueios = document.getElementById('btn-limpar-bloqueios');

async function enviarDados(url, dados) {
  return buscarDados(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
}

async function buscarDados(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);
  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.mensagem || 'Erro na requisição.');
  }

  return resultado;
}

function pegarToken() {
  return sessionStorage.getItem('token');
}

function headersComToken() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${pegarToken()}`
  };
}

function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  let area = document.getElementById('area-notificacoes');

  if (!area) {
    area = document.createElement('div');
    area.id = 'area-notificacoes';
    area.className = 'notificacao-area';
    document.body.appendChild(area);
  }

  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.textContent = mensagem;
  area.appendChild(notificacao);

  setTimeout(() => {
    notificacao.remove();
  }, 3500);
}

function verificarLogin() {
  if (!pegarToken()) {
    mostrarNotificacao('Faça login para acessar esta página.', 'erro');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
    return false;
  }

  return true;
}

function verificarCliente() {
  if (!verificarLogin()) return;

  if (sessionStorage.getItem('tipo') !== 'cliente') {
    mostrarNotificacao('Acesso permitido apenas para clientes.', 'erro');
    setTimeout(() => {
      window.location.href = 'dashboard-admin.html';
    }, 900);
    return false;
  }

  return true;
}

function verificarAdmin() {
  if (!verificarLogin()) return;

  if (sessionStorage.getItem('tipo') !== 'admin') {
    mostrarNotificacao('Acesso permitido apenas para administradores.', 'erro');
    setTimeout(() => {
      window.location.href = 'dashboard-cliente.html';
    }, 900);
    return false;
  }

  return true;
}

function montarTabela(cabecalhos, linhas) {
  return `
    <table class="table table-sm">
      <thead>
        <tr>${cabecalhos.map((texto) => `<th>${texto}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${linhas.map((linha) => `
          <tr>${linha.map((valor) => `<td>${valor}</td>`).join('')}</tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function botaoCancelar(classe, id) {
  return `
    <button class="btn btn-sm btn-outline-danger ${classe}" data-id="${id}">
      Cancelar
    </button>
  `;
}

function botaoRemover(classe, id) {
  return `
    <button class="btn btn-sm btn-outline-danger ${classe}" data-id="${id}">
      Excluir
    </button>
  `;
}

if (formCadastro) {
  formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      telefone: document.getElementById('telefone').value,
      cpf: document.getElementById('cpf').value
    };

    try {
      await enviarDados(`${API_URL}/auth/register`, dados);
      mostrarNotificacao('Cadastro realizado com sucesso.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);
    } catch (erro) {
      mostrarNotificacao(erro.message, 'erro');
    }
  });
}

async function carregarServicos() {
  const servicos = await buscarDados(`${API_URL}/servicos`);
  const lista = document.getElementById('lista-servicos');
  const select = document.getElementById('servico_id');

  lista.innerHTML = montarTabela(
    ['Nome', 'Preço', 'Duração'],
    servicos.map((servico) => [servico.nome, `R$ ${servico.preco}`, `${servico.duracao} min`])
  );

  select.innerHTML = servicos.map((servico) => (
    `<option value="${servico.id}">${servico.nome}</option>`
  )).join('');
}

async function carregarProfissionais() {
  const profissionais = await buscarDados(`${API_URL}/profissionais`);
  const lista = document.getElementById('lista-profissionais');
  const select = document.getElementById('profissional_id');

  lista.innerHTML = montarTabela(
    ['Nome', 'Especialidade', 'Status'],
    profissionais.map((profissional) => [
      profissional.nome,
      profissional.especialidade || '-',
      profissional.disponivel ? 'Disponível' : 'Indisponível'
    ])
  );

  select.innerHTML = profissionais
    .filter((profissional) => profissional.disponivel)
    .map((profissional) => (
      `<option value="${profissional.id}">${profissional.nome}</option>`
    ))
    .join('');
}

async function carregarMeusAgendamentos() {
  const agendamentos = await buscarDados(`${API_URL}/agendamentos/meus`, {
    headers: headersComToken()
  });
  const area = document.getElementById('meus-agendamentos');

  area.innerHTML = montarTabela(
    ['Data', 'Serviço', 'Profissional', 'Status', ''],
    agendamentos.map((item) => [
      item.data_hora,
      item.servico_nome,
      item.profissional_nome,
      item.status,
      item.status === 'Confirmado' ? botaoCancelar('btn-cancelar', item.id) : ''
    ])
  );
}

async function criarAgendamento(evento) {
  evento.preventDefault();

  const dados = {
    servico_id: document.getElementById('servico_id').value,
    profissional_id: document.getElementById('profissional_id').value,
    data_hora: document.getElementById('data_hora').value
  };

  try {
    await buscarDados(`${API_URL}/agendamentos`, {
      method: 'POST',
      headers: headersComToken(),
      body: JSON.stringify(dados)
    });

    mostrarNotificacao('Agendamento criado com sucesso.');
    formAgendamento.reset();
    carregarMeusAgendamentos();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function cancelarAgendamento(id) {
  try {
    await buscarDados(`${API_URL}/agendamentos/${id}/cancelar`, {
      method: 'PATCH',
      headers: headersComToken()
    });

    mostrarNotificacao('Agendamento cancelado com sucesso.');
    carregarMeusAgendamentos();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function limparMeusAgendamentos() {
  if (!confirm('Remover agendamentos cancelados da sua lista?')) return;

  try {
    const resultado = await buscarDados(`${API_URL}/agendamentos/meus/limpar`, {
      method: 'DELETE',
      headers: headersComToken()
    });

    mostrarNotificacao(resultado.mensagem);
    carregarMeusAgendamentos();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

function configurarDashboardCliente() {
  if (!verificarCliente()) return;
  carregarServicos();
  carregarProfissionais();
  carregarMeusAgendamentos();

  formAgendamento.addEventListener('submit', criarAgendamento);

  document.getElementById('meus-agendamentos').addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-cancelar')) {
      cancelarAgendamento(evento.target.dataset.id);
    }
  });

  btnLimparMeus.addEventListener('click', limparMeusAgendamentos);
}

if (formAgendamento) {
  configurarDashboardCliente();
}

async function carregarClientesAdmin() {
  const clientes = await buscarDados(`${API_URL}/clientes`, { headers: headersComToken() });
  const area = document.getElementById('admin-lista-clientes');

  area.innerHTML = montarTabela(
    ['Nome', 'Email', 'Telefone', 'CPF'],
    clientes.map((cliente) => [cliente.nome, cliente.email, cliente.telefone, cliente.cpf])
  );
}

async function carregarServicosAdmin() {
  const servicos = await buscarDados(`${API_URL}/servicos`, { headers: headersComToken() });
  const area = document.getElementById('admin-lista-servicos');

  area.innerHTML = montarTabela(
    ['Nome', 'Preço', 'Duração'],
    servicos.map((servico) => [servico.nome, `R$ ${servico.preco}`, `${servico.duracao} min`])
  );
}

async function carregarProfissionaisAdmin() {
  const profissionais = await buscarDados(`${API_URL}/profissionais`, {
    headers: headersComToken()
  });
  const area = document.getElementById('admin-lista-profissionais');
  const select = document.getElementById('bloqueio-profissional');

  area.innerHTML = montarTabela(
    ['Nome', 'Especialidade', 'Status', 'Ação'],
    profissionais.map((profissional) => [
      profissional.nome,
      profissional.especialidade || '-',
      profissional.disponivel ? 'Disponível' : 'Indisponível',
      botaoRemover('btn-remover-profissional', profissional.id)
    ])
  );

  select.innerHTML = profissionais.map((profissional) => (
    `<option value="${profissional.id}">${profissional.nome}</option>`
  )).join('');
}

async function carregarAgendamentosAdmin() {
  const agendamentos = await buscarDados(`${API_URL}/agendamentos`, {
    headers: headersComToken()
  });
  const area = document.getElementById('admin-lista-agendamentos');

  area.innerHTML = montarTabela(
    ['Data', 'Cliente', 'Serviço', 'Profissional', 'Status', 'Ação'],
    agendamentos.map((item) => [
      item.data_hora,
      item.cliente_nome,
      item.servico_nome,
      item.profissional_nome,
      item.status,
      item.status === 'Confirmado'
        ? botaoCancelar('btn-cancelar-admin', item.id)
        : ''
    ])
  );
}

async function cancelarAgendamentoAdmin(id) {
  try {
    await buscarDados(`${API_URL}/agendamentos/${id}/cancelar`, {
      method: 'PATCH',
      headers: headersComToken()
    });

    mostrarNotificacao('Agendamento cancelado com sucesso.');
    carregarAgendamentosAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function limparAgendamentosAdmin() {
  if (!confirm('Remover agendamentos cancelados da lista?')) return;

  try {
    const resultado = await buscarDados(`${API_URL}/agendamentos/limpar`, {
      method: 'DELETE',
      headers: headersComToken()
    });

    mostrarNotificacao(resultado.mensagem);
    carregarAgendamentosAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function carregarBloqueiosAdmin() {
  const bloqueios = await buscarDados(`${API_URL}/bloqueios`, {
    headers: headersComToken()
  });
  const area = document.getElementById('admin-lista-bloqueios');

  area.innerHTML = montarTabela(
    ['Profissional', 'Data', 'Motivo'],
    bloqueios.map((bloqueio) => [
      bloqueio.profissional_nome || bloqueio.profissional_id,
      bloqueio.data_hora,
      bloqueio.motivo
    ])
  );
}

async function limparBloqueiosAdmin() {
  if (!confirm('Remover todos os bloqueios da lista?')) return;

  try {
    const resultado = await buscarDados(`${API_URL}/bloqueios`, {
      method: 'DELETE',
      headers: headersComToken()
    });

    mostrarNotificacao(resultado.mensagem);
    carregarBloqueiosAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function removerProfissional(id) {
  if (!confirm('Excluir este profissional?')) return;

  try {
    const resultado = await buscarDados(`${API_URL}/profissionais/${id}`, {
      method: 'DELETE',
      headers: headersComToken()
    });

    mostrarNotificacao(resultado.mensagem);
    carregarProfissionaisAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function criarServico(evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('servico-nome').value,
    descricao: document.getElementById('servico-descricao').value,
    preco: document.getElementById('servico-preco').value,
    duracao: document.getElementById('servico-duracao').value
  };

  try {
    await buscarDados(`${API_URL}/servicos`, {
      method: 'POST',
      headers: headersComToken(),
      body: JSON.stringify(dados)
    });

    mostrarNotificacao('Serviço criado com sucesso.');
    formServico.reset();
    carregarServicosAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function criarProfissional(evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('profissional-nome').value,
    especialidade: document.getElementById('profissional-especialidade').value,
    disponivel: document.getElementById('profissional-disponivel').value
  };

  try {
    await buscarDados(`${API_URL}/profissionais`, {
      method: 'POST',
      headers: headersComToken(),
      body: JSON.stringify(dados)
    });

    mostrarNotificacao('Profissional criado com sucesso.');
    formProfissional.reset();
    carregarProfissionaisAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

async function criarBloqueio(evento) {
  evento.preventDefault();

  const dados = {
    profissional_id: document.getElementById('bloqueio-profissional').value,
    data_hora: document.getElementById('bloqueio-data-hora').value,
    motivo: document.getElementById('bloqueio-motivo').value
  };

  try {
    await buscarDados(`${API_URL}/bloqueios`, {
      method: 'POST',
      headers: headersComToken(),
      body: JSON.stringify(dados)
    });

    mostrarNotificacao('Bloqueio criado com sucesso.');
    formBloqueio.reset();
    carregarBloqueiosAdmin();
  } catch (erro) {
    mostrarNotificacao(erro.message, 'erro');
  }
}

function configurarDashboardAdmin() {
  if (!verificarAdmin()) return;
  carregarClientesAdmin();
  carregarServicosAdmin();
  carregarProfissionaisAdmin();
  carregarAgendamentosAdmin();
  carregarBloqueiosAdmin();

  formServico.addEventListener('submit', criarServico);
  formProfissional.addEventListener('submit', criarProfissional);
  formBloqueio.addEventListener('submit', criarBloqueio);

  document.getElementById('admin-lista-agendamentos').addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-cancelar-admin')) {
      cancelarAgendamentoAdmin(evento.target.dataset.id);
    }
  });

  document.getElementById('admin-lista-profissionais').addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-remover-profissional')) {
      removerProfissional(evento.target.dataset.id);
    }
  });

  btnLimparAgendamentos.addEventListener('click', limparAgendamentosAdmin);
  btnLimparBloqueios.addEventListener('click', limparBloqueiosAdmin);
}

if (formServico) {
  configurarDashboardAdmin();
}

if (btnSair) {
  btnSair.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  });
}

if (formLogin) {
  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dados = {
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    };

    try {
      const resultado = await enviarDados(`${API_URL}/auth/login`, dados);

      // Guarda dados usados nas proximas telas.
      sessionStorage.setItem('token', resultado.token);
      sessionStorage.setItem('tipo', resultado.tipo);

      mostrarNotificacao('Login realizado com sucesso.');

      setTimeout(() => {
        if (resultado.tipo === 'admin') {
          window.location.href = 'dashboard-admin.html';
        } else {
          window.location.href = 'dashboard-cliente.html';
        }
      }, 900);
    } catch (erro) {
      mostrarNotificacao(erro.message, 'erro');
    }
  });
}
