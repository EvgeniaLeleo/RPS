document.addEventListener('DOMContentLoaded', () => {
  window.application = {
    blocks: {}, // функции, которые получают на вход объект-узел контейнера и отрисовывают туда какой-то блок

    screens: {}, // функции, которые отрисовывают экран полностью, очищают блок document.querySelector('.app') и отрисовывают туда содержимое

    timers: [],

    moves: 0, // количество ходов в данной игре

    renderScreen: function (screenName) {
      if (!this.screens[screenName]) {
        console.log(`There is no screen "${screenName}"`);
        return;
      }

      this.timers.forEach((timer) => {
        clearInterval(timer);
      });

      this.timers.splice(0, this.timers.length);

      this.screens[screenName]();
    },

    renderBlock: function (blockName, container) {
      if (!this.blocks[blockName]) {
        console.log(`There is no block "${blockName}"`);
        return;
      }

      this.blocks[blockName](container);
    },
  };

  window.application.blocks['loginBlock'] = renderLoginBlock;
  window.application.blocks['playerListBlock'] = renderPlayerListBlock;
  window.application.blocks['playButtonBlock'] = renderPlayButton;

  window.application.screens['loginScreen'] = renderLoginScreen;
  window.application.screens['lobbyScreen'] = renderLobbyScreen;
  window.application.screens[
    'waitingForStartScreen'
  ] = renderWaitingForStartScreen;
  window.application.screens['moveScreen'] = renderMoveScreen;
  window.application.screens[
    'waitingForEnemyMoveScreen'
  ] = renderWaitingForEnemyMoveScreen;
  window.application.screens['winScreen'] = renderWinScreen;
  window.application.screens['loseScreen'] = renderLoseScreen;

  const buttonStart = document.querySelector('.button-start');

  buttonStart.addEventListener('click', () => {
    window.application.renderScreen('loginScreen');

    authorize();
  });
});

/**ЛОГИН
 *
 * При отрисовке блок рендерит текстовое поле ввода и кнопку «Войти».
 *
 * При нажатии кнопки делает AJAX-запрос на ручку /login для получения токена. Токен необходимо положить в window.application
 */

function authorize() {
  const formLogin = document.querySelector('.form-login');

  formLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputLogin = formLogin.querySelector('.input-login');

    const params = new URLSearchParams();
    params.append('login', inputLogin.value);

    httpRequest({
      url: '/login',
      params,
      onSuccess: getToken,
    });
  });
}

function getToken(userData) {
  window.application.token = userData.token;

  checkPlayerStatus();
}

/**
 * После получения токена делает запрос на статус игрока (ручка /player-status).
 */

function checkPlayerStatus() {
  const params = new URLSearchParams();
  params.append('token', window.application.token);

  httpRequest({
    url: '/player-status',
    params,
    onSuccess: renderLoginNextScreen,
  });
}

/**
 * В зависимости от получаемого от этой ручки статуса переходит в лобби (обычный сценарий) или в бой (если вдруг игрок отключился от боя, но перезашел, например, через другой браузер).
 */

function renderLoginNextScreen(userData) {
  if (userData.status === 'error') {
    console.log('Нет игрока с таким токеном');
  }

  if (
    userData.status === 'ok' &&
    userData['player-status']['status'] === 'lobby'
  ) {
    window.application.renderScreen('lobbyScreen'); // переход в ЛОББИ - файл lobby.js

    const currentPlayerContainer = document.querySelector(
      '.current-player-container'
    );
    const playerListContainer = document.querySelector(
      '.player-list-container'
    );

    generatePlayerList(playerListContainer, currentPlayerContainer);
  }

  if (
    userData.status === 'ok' &&
    userData['player-status']['status'] === 'game'
  ) {
    window.application.gameId = userData['player-status']['game']['id'];

    window.application.renderScreen('waitingForStartScreen'); // переход в бой

    waitForEnemy();
  }
}

/**
 * ПЕРЕХОД из Лобби
 *
 * Запрос на ручку /start. После получения ответа от ручки с id боя необходимо записать id боя в window.application. После чего необходимо отрисовать страницу ожидания соперника.
 */

function getGameId() {
  const params = new URLSearchParams();
  params.append('token', window.application.token);

  httpRequest({
    url: '/start',
    params,
    onSuccess: renderLobbyNextScreen,
  });
}

function renderLobbyNextScreen(userData) {
  if (userData['message'] === `token doesn't exist`) {
    console.log('Нет игрока с таким токеном');
  }

  if (userData['message'] === `player is already in game`) {
    console.log('Игрок уже в игре, нельзя начать две игры одновременно');
  }

  if (userData.status === 'ok') {
    window.application.gameId = userData['player-status']['game']['id'];

    window.application.renderScreen('waitingForStartScreen'); // переход в бой

    waitForEnemy();
  }
}

/**
 * ОЖИДАНИЕ ИГРЫ
 *
 * Блок ожидания игры
 *
 * Визуально предоставляет пользователю информацию о том, что он ожидает начало игры. Сразу после отрисовки использует id игры, записанный после клика на блок кнопки «Играть!», и делает запросы раз в полсекунды в ручку /game-status. Как только в ответе придет статус, отличный от 'waiting-for-start', отрисовываем экран хода.
 */

function waitForEnemy() {
  const waitingTimer = setInterval(checkGameStatus, 500); //  в файле check-game-status.js
  window.application.timers.push(waitingTimer);
}

/**
 * ХОД
 *
 *После клика на кнопку должен произойти запрос на ручку /play с данными игры и хода.
 */

function sendMove() {
  const rockButton = document.querySelector('.rock-button');
  const paperButton = document.querySelector('.paper-button');
  const scissorsButton = document.querySelector('.scissors-button');

  rockButton.addEventListener('click', () => {
    sendCurrentMove('rock');
  });

  paperButton.addEventListener('click', () => {
    sendCurrentMove('paper');
  });

  scissorsButton.addEventListener('click', () => {
    sendCurrentMove('scissors');
  });

  function sendCurrentMove(element) {
    window.application.moves += 1;

    const params = new URLSearchParams();

    params.append('token', window.application.token);
    params.append('id', window.application.gameId);
    params.append('move', element);

    httpRequest({
      url: '/play',
      params,
      onSuccess: renderMoveNextScreen,
    });
  }
}

/**
 * В зависимости от ответа должен произойти переход либо на страницу ожидания хода соперника, либо на страницу победы, либо на страницу поражения.
 */

function renderMoveNextScreen(userData) {
  if (userData['game-status']['status'] === 'waiting-for-enemy-move') {
    window.application.renderScreen('waitingForEnemyMoveScreen');

    waitForEnemy();
  }

  if (userData['game-status']['status'] === 'waiting-for-your-move') {
    window.application.renderScreen('moveScreen');

    const enemyName = document.querySelector('.enemy-name');
    enemyName.textContent = `Вы и ${userData['game-status']['enemy']['login']} сделали одинаковые ходы. Попробуйте еще раз!`;

    sendMove();
  }

  if (userData['game-status']['status'] === 'win') {
    window.application.renderScreen('winScreen');
    addButtonsToScreen();
  }

  if (userData['game-status']['status'] === 'lose') {
    window.application.renderScreen('loseScreen');
    addButtonsToScreen();
  }
}

/**
 * Кнопки для экранов Победы и Поражения
 */

function addButtonsToScreen() {
  const returnToLobbyButton = document.querySelector('.return-to-lobby-button');

  returnToLobbyButton.addEventListener('click', () => {
    window.application.moves = 0;
    window.application.renderScreen('lobbyScreen');

    const currentPlayerContainer = document.querySelector(
      '.current-player-container'
    );

    const playerListContainer = document.querySelector(
      '.player-list-container'
    );

    generatePlayerList(playerListContainer, currentPlayerContainer);
  });

  const playAgainButton = document.querySelector('.play-again-button');

  playAgainButton.addEventListener('click', () => {
    window.application.moves = 0;
    getGameId();
  });
}
