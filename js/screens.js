const app = document.querySelector('.app');

/**
 * Экран авторизации
 * */

function renderLoginScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Введите логин';

  const content = document.createElement('div');

  app.appendChild(title);
  app.appendChild(content);

  window.application.renderBlock('loginBlock', content);
}

/**
 * Экран лобби
 * */

function renderLobbyScreen() {
  app.textContent = '';

  const lobbyContent = document.createElement('div');
  lobbyContent.classList.add('lobby-container');

  const title = document.createElement('h2');
  title.textContent = 'Лобби';

  const currentPlayerData = document.createElement('div'); // данные о победах и поражениях
  currentPlayerData.classList.add('current-player-container');
  const winsText = document.createElement('p');
  winsText.textContent = 'Ваши победы: ...';

  const losesText = document.createElement('p');
  losesText.textContent = 'Ваши поражения: ...';

  currentPlayerData.appendChild(winsText);
  currentPlayerData.appendChild(losesText);

  const playerContainer = document.createElement('div'); // список участников
  playerContainer.classList.add('player-container');

  app.appendChild(lobbyContent);
  lobbyContent.appendChild(title);
  lobbyContent.appendChild(currentPlayerData);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  lobbyContent.appendChild(buttonContainer);

  window.application.renderBlock('playButtonBlock', buttonContainer); // кнопка Начать игру

  renderButton('button-quit', 'Выйти', buttonContainer); // кнопка Выхода из игры

  lobbyContent.appendChild(playerContainer);

  window.application.renderBlock('playerListBlock', playerContainer); // генерация списка участников
}

/**
 * Экран ожидания игры
 */

function renderWaitingForStartScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Игра';
  app.appendChild(title);

  const waitingContent = document.createElement('div');
  waitingContent.classList.add('waiting-content');
  waitingContent.textContent = 'Ожидаем подключение соперника...';
  app.appendChild(waitingContent);
}

/**
 * Экран хода
 */

function renderMoveScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Ваш ход';
  app.appendChild(title);

  const enemyName = document.createElement('div');
  enemyName.classList.add('enemy-name');
  app.appendChild(enemyName);

  const buttons = document.createElement('div');
  buttons.classList.add('buttons-move');
  app.appendChild(buttons);

  renderButton('rock-button', 'Камень', buttons);
  renderButton('scissors-button', 'Ножницы', buttons);
  renderButton('paper-button', 'Бумага', buttons);
}

/**
 * Экран ожидания хода соперника
 */

function renderWaitingForEnemyMoveScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Ожидаем ход соперника...';
  app.appendChild(title);
}

/**
 * Экран победы
 */

function renderWinScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Победа!';
  app.appendChild(title);

  const buttons = document.createElement('div');
  buttons.classList.add('buttons-move');
  app.appendChild(buttons);

  renderButton('return-to-lobby-button', 'В лобби', buttons);
  renderButton('play-again-button', 'Играть еще!', buttons);
}

/**
 * Экран поражения
 */

function renderLoseScreen() {
  app.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Вы проиграли!';
  app.appendChild(title);

  const buttons = document.createElement('div');
  buttons.classList.add('buttons-move');
  app.appendChild(buttons);

  renderButton('return-to-lobby-button', 'В лобби', buttons);
  renderButton('play-again-button', 'Играть еще!', buttons);
}
