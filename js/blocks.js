/**
 * ЛОГИН
 *
 * Блок авторизации */

function renderLoginBlock(container) {
  const form = document.createElement('form');
  form.classList.add('form-login');

  const input = document.createElement('input');
  input.classList.add('input-login');
  input.autofocus = true;
  input.setAttribute('required', 'required');

  const button = document.createElement('button');
  button.textContent = 'Войти!';

  container.appendChild(form);
  form.appendChild(input);
  form.appendChild(button);
}

/**
 * ЛОББИ
 *
 * Блок списка игроков
 */

function renderPlayerListBlock(container) {
  const playerList = document.createElement('div');
  playerList.classList.add('player-list-container');
  playerList.textContent = 'Список игроков загружается...';

  container.appendChild(playerList);
}

/**
 * Блок кнопки «Играть!»
 */

function renderPlayButton(container) {
  const button = document.createElement('button');
  button.classList.add('button-play');
  button.textContent = 'Начать игру!';

  container.appendChild(button);
}

/**
 * Блок произвольной кнопки
 */

function renderButton(name, content, container) {
  const button = document.createElement('button');
  button.classList.add(`${name}`);
  button.textContent = content;

  container.appendChild(button);
}
