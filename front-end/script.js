// Hed Bank Simulation Frontend
// Persist theme and language in localStorage
const DEFAULT_LANG = 'en';
const DEFAULT_THEME = 'dark';

// Translations
const i18n = {
  en: {
    appTitle: 'Hed Bank',
    appSubtitle: 'Simulated transfers',
    listAccounts: 'List accounts',
    insertAccount: 'Insert new account',
    operations: 'Operations',
    accountType: 'Account type',
    physical: 'Physical',
    legal: 'Legal',
    customerName: 'Customer name',
    openingBalance: 'Opening balance',
    credit: 'Credit',
    create: 'Create',
    cancel: 'Cancel',
    transfer: 'Transfer',
    withdraw: 'Withdraw',
    deposit: 'Deposit',
    fromAccount: 'From account index',
    toAccount: 'To account index',
    amount: 'Amount',
    accountNumber: 'Account index',
    accountsNone: 'No account registered.',
    createdSuccess: 'Account created successfully.',
    transferSuccess: 'Transfer completed.',
    withdrawSuccess: 'Withdrawal completed.',
    depositSuccess: 'Deposit completed.',
    invalidIndex: 'Invalid account index.',
    insufficientFunds: 'Insufficient funds or credit.',
    operationsTitle: 'Operations'
  },
  pt: {
    appTitle: 'Hed Bank',
    appSubtitle: 'Simulação de transferências',
    listAccounts: 'Listar contas',
    insertAccount: 'Inserir nova conta',
    operations: 'Operações',
    accountType: 'Tipo de conta',
    physical: 'Física',
    legal: 'Jurídica',
    customerName: 'Nome do cliente',
    openingBalance: 'Saldo inicial',
    credit: 'Crédito',
    create: 'Criar',
    cancel: 'Cancelar',
    transfer: 'Transferir',
    withdraw: 'Sacar',
    deposit: 'Depositar',
    fromAccount: 'Conta origem (índice)',
    toAccount: 'Conta destino (índice)',
    amount: 'Valor',
    accountNumber: 'Índice da conta',
    accountsNone: 'Nenhuma conta cadastrada.',
    createdSuccess: 'Conta criada com sucesso.',
    transferSuccess: 'Transferência realizada.',
    withdrawSuccess: 'Saque realizado.',
    depositSuccess: 'Depósito realizado.',
    invalidIndex: 'Índice de conta inválido.',
    insufficientFunds: 'Fundos ou crédito insuficientes.',
    operationsTitle: 'Operações'
  },
  es: {
    appTitle: 'Hed Bank',
    appSubtitle: 'Simulación de transferencias',
    listAccounts: 'Listar cuentas',
    insertAccount: 'Insertar nueva cuenta',
    operations: 'Operaciones',
    accountType: 'Tipo de cuenta',
    physical: 'Física',
    legal: 'Jurídica',
    customerName: 'Nombre del cliente',
    openingBalance: 'Saldo inicial',
    credit: 'Crédito',
    create: 'Crear',
    cancel: 'Cancelar',
    transfer: 'Transferir',
    withdraw: 'Retirar',
    deposit: 'Depositar',
    fromAccount: 'Cuenta origen (índice)',
    toAccount: 'Cuenta destino (índice)',
    amount: 'Importe',
    accountNumber: 'Índice de cuenta',
    accountsNone: 'No hay cuentas registradas.',
    createdSuccess: 'Cuenta creada con éxito.',
    transferSuccess: 'Transferencia completada.',
    withdrawSuccess: 'Retiro completado.',
    depositSuccess: 'Depósito completado.',
    invalidIndex: 'Índice de cuenta inválido.',
    insufficientFunds: 'Fondos o crédito insuficientes.',
    operationsTitle: 'Operaciones'
  }
};

// Simple account model in front-end
class Account {
  constructor(type, name, balance = 0, credit = 0) {
    this.type = type; // 0 physical, 1 legal
    this.name = name;
    this.balance = Number(balance);
    this.credit = Number(credit);
  }

  withdraw(amount) {
    amount = Number(amount);
    if (this.balance + this.credit < amount) return false;
    this.balance -= amount;
    return true;
  }

  deposit(amount) {
    amount = Number(amount);
    this.balance += amount;
    return true;
  }

  transfer(amount, destAccount) {
    if (!this.withdraw(amount)) return false;
    destAccount.deposit(amount);
    return true;
  }

  toString() {
    return `${this.name} — ${this.type === 0 ? 'Physical' : 'Legal'} — Balance: ${this.balance.toFixed(2)} — Credit: ${this.credit.toFixed(2)}`;
  }
}

// App state
const state = {
  accounts: [],
  lang: localStorage.getItem('hb_lang') || DEFAULT_LANG,
  theme: localStorage.getItem('hb_theme') || DEFAULT_THEME
};

// DOM refs
const langSelect = document.getElementById('lang-select');
const themeToggle = document.getElementById('theme-toggle');
const accountsList = document.getElementById('accounts-list');
const btnList = document.getElementById('btn-list');
const btnNew = document.getElementById('btn-new');
const formCreate = document.getElementById('form-create');
const createAccountBtn = document.getElementById('create-account');
const cancelCreateBtn = document.getElementById('cancel-create');
const inputType = document.getElementById('input-type');
const inputName = document.getElementById('input-name');
const inputBalance = document.getElementById('input-balance');
const inputCredit = document.getElementById('input-credit');

const transferFrom = document.getElementById('transfer-from');
const transferTo = document.getElementById('transfer-to');
const transferAmount = document.getElementById('transfer-amount');
const doTransferBtn = document.getElementById('do-transfer');

const withdrawIndex = document.getElementById('withdraw-index');
const withdrawAmount = document.getElementById('withdraw-amount');
const doWithdrawBtn = document.getElementById('do-withdraw');

const depositIndex = document.getElementById('deposit-index');
const depositAmount = document.getElementById('deposit-amount');
const doDepositBtn = document.getElementById('do-deposit');

const appTitle = document.getElementById('app-title');
const appSubtitle = document.getElementById('app-subtitle');

// Initialize
function init() {
  // Apply theme and language
  applyTheme(state.theme);
  langSelect.value = state.lang;
  applyTranslations();

  // Event listeners
  langSelect.addEventListener('change', onLangChange);
  themeToggle.addEventListener('click', toggleTheme);

  btnList.addEventListener('click', renderAccounts);
  btnNew.addEventListener('click', () => toggleCreateForm(true));
  cancelCreateBtn.addEventListener('click', () => toggleCreateForm(false));
  createAccountBtn.addEventListener('click', createAccount);

  doTransferBtn.addEventListener('click', doTransfer);
  doWithdrawBtn.addEventListener('click', doWithdraw);
  doDepositBtn.addEventListener('click', doDeposit);

  // Load persisted accounts if any
  const saved = localStorage.getItem('hb_accounts');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.accounts = parsed.map(a => new Account(a.type, a.name, a.balance, a.credit));
    } catch(e) { state.accounts = []; }
  }

  renderAccounts();
}

// Theme functions
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  state.theme = theme;
  localStorage.setItem('hb_theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function toggleTheme() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// Language functions
function onLangChange(e) {
  state.lang = e.target.value;
  localStorage.setItem('hb_lang', state.lang);
  applyTranslations();
}

function t(key) {
  return (i18n[state.lang] && i18n[state.lang][key]) || i18n[DEFAULT_LANG][key] || key;
}

function applyTranslations() {
  // Replace all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Titles
  appTitle.textContent = t('appTitle');
  appSubtitle.textContent = t('appSubtitle');
  document.getElementById('footer-text').textContent = `© ${t('appTitle')} Simulation`;
}

// Account UI
function renderAccounts() {
  accountsList.innerHTML = '';
  if (state.accounts.length === 0) {
    const p = document.createElement('div');
    p.className = 'account-card';
    p.textContent = t('accountsNone');
    accountsList.appendChild(p);
    return;
  }

  state.accounts.forEach((acc, idx) => {
    const card = document.createElement('div');
    card.className = 'account-card';

    const meta = document.createElement('div');
    meta.className = 'account-meta';
    const title = document.createElement('strong');
    title.textContent = `${idx} — ${acc.name}`;
    const sub = document.createElement('small');
    sub.textContent = `${acc.type === 0 ? t('physical') : t('legal')} • ${t('openingBalance')}: ${acc.balance.toFixed(2)} • ${t('credit')}: ${acc.credit.toFixed(2)}`;
    meta.appendChild(title);
    meta.appendChild(sub);

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const btnDeposit = document.createElement('button');
    btnDeposit.className = 'btn';
    btnDeposit.textContent = t('deposit');
    btnDeposit.addEventListener('click', () => {
      const amount = prompt(t('amount'));
      if (amount) {
        acc.deposit(Number(amount));
        persistAccounts();
        renderAccounts();
        alert(t('depositSuccess'));
      }
    });

    const btnWithdraw = document.createElement('button');
    btnWithdraw.className = 'btn';
    btnWithdraw.textContent = t('withdraw');
    btnWithdraw.addEventListener('click', () => {
      const amount = prompt(t('amount'));
      if (amount) {
        if (!acc.withdraw(Number(amount))) {
          alert(t('insufficientFunds'));
        } else {
          persistAccounts();
          renderAccounts();
          alert(t('withdrawSuccess'));
        }
      }
    });

    actions.appendChild(btnDeposit);
    actions.appendChild(btnWithdraw);

    card.appendChild(meta);
    card.appendChild(actions);
    accountsList.appendChild(card);
  });
}

// Create account
function toggleCreateForm(show) {
  formCreate.classList.toggle('hidden', !show);
  formCreate.setAttribute('aria-hidden', !show);
}

function createAccount() {
  const type = Number(inputType.value);
  const name = inputName.value.trim();
  const balance = Number(inputBalance.value) || 0;
  const credit = Number(inputCredit.value) || 0;

  if (!name) {
    alert(t('customerName') + ' is required');
    return;
  }

  const acc = new Account(type, name, balance, credit);
  state.accounts.push(acc);
  persistAccounts();
  toggleCreateForm(false);
  renderAccounts();
  alert(t('createdSuccess'));
  // clear inputs
  inputName.value = '';
  inputBalance.value = '0';
  inputCredit.value = '0';
}

// Transfer
function doTransfer() {
  const from = Number(transferFrom.value);
  const to = Number(transferTo.value);
  const amount = Number(transferAmount.value);

  if (!validIndex(from) || !validIndex(to)) {
    alert(t('invalidIndex'));
    return;
  }
  if (amount <= 0) return;

  const aFrom = state.accounts[from];
  const aTo = state.accounts[to];
  if (!aFrom.transfer(amount, aTo)) {
    alert(t('insufficientFunds'));
    return;
  }
  persistAccounts();
  renderAccounts();
  alert(t('transferSuccess'));
  transferFrom.value = '';
  transferTo.value = '';
  transferAmount.value = '';
}

// Withdraw
function doWithdraw() {
  const idx = Number(withdrawIndex.value);
  const amount = Number(withdrawAmount.value);
  if (!validIndex(idx)) { alert(t('invalidIndex')); return; }
  if (amount <= 0) return;
  const acc = state.accounts[idx];
  if (!acc.withdraw(amount)) { alert(t('insufficientFunds')); return; }
  persistAccounts();
  renderAccounts();
  alert(t('withdrawSuccess'));
  withdrawIndex.value = '';
  withdrawAmount.value = '';
}

// Deposit
function doDeposit() {
  const idx = Number(depositIndex.value);
  const amount = Number(depositAmount.value);
  if (!validIndex(idx)) { alert(t('invalidIndex')); return; }
  if (amount <= 0) return;
  const acc = state.accounts[idx];
  acc.deposit(amount);
  persistAccounts();
  renderAccounts();
  alert(t('depositSuccess'));
  depositIndex.value = '';
  depositAmount.value = '';
}

// Helpers
function validIndex(i) {
  return Number.isInteger(i) && i >= 0 && i < state.accounts.length;
}

function persistAccounts() {
  localStorage.setItem('hb_accounts', JSON.stringify(state.accounts));
}

// Start
init();
