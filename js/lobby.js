/**
 * ЛОББИ
 *
 * Блок списка игроков должен уметь раз в секунду опрашивать ручку /player-list и обновлять свое содержимое в соответствии с полученными от этой ручки данными. Минимально — просто выводить логины.
 */

function generatePlayerList(container, currentUserContainer) {
  const buttonPlay = document.querySelector('.button-play');
  buttonPlay.setAttribute('disabled', 'disabled');

  const checkPlayerListTimer = setInterval(checkPlayerList, 1000);

  window.application.timers.push(checkPlayerListTimer);

  function checkPlayerList() {
    const params = new URLSearchParams();
    params.append('token', window.application.token);

    httpRequest({
      url: '/player-list',
      params,
      onSuccess: renderPlayerList,
    });
  }

  function renderPlayerList(userData) {
    currentUserContainer.textContent = ''; // данные о победах и поражениях пользователя
    container.textContent = ''; // данные о победах и поражениях всех игроков

    userData['list'].forEach((player) => {
      renderPlayerData(player);

      buttonPlay.removeAttribute('disabled', 'disabled');
    });
  }

  function renderPlayerData(player) {
    // вывод данных пользователя:
    if (player['you'] === true) {
      const winsText = document.createElement('p');
      winsText.textContent = 'Ваши победы: ';

      const losesText = document.createElement('p');
      losesText.textContent = 'Ваши поражения: ';

      currentUserContainer.appendChild(winsText);
      currentUserContainer.appendChild(losesText);

      const currentPlayerWins = document.createElement('span');
      currentPlayerWins.classList.add('player-wins');
      currentPlayerWins.textContent = player['wins'];

      winsText.appendChild(currentPlayerWins);

      const currentPlayerLoses = document.createElement('span');
      currentPlayerLoses.classList.add('player-loses');
      currentPlayerLoses.textContent = player['loses'];

      losesText.appendChild(currentPlayerLoses);
    }

    // вывод данных всех игроков в Лобби:

    const p = document.createElement('p');

    const playerLogin = document.createElement('span');
    playerLogin.classList.add('player-login');
    playerLogin.textContent = player['login'] + ' (';

    const playerWins = document.createElement('span');
    playerWins.classList.add('player-wins');
    playerWins.textContent = player['wins'];

    const playerLoses = document.createElement('span');
    playerLoses.classList.add('player-loses');
    playerLoses.textContent = player['loses'];

    const comma = document.createElement('span');
    comma.textContent = ', ';

    const bracket = document.createElement('span');
    bracket.textContent = ')';

    container.appendChild(p);
    p.appendChild(playerLogin);
    p.appendChild(playerWins);
    p.appendChild(comma);
    p.appendChild(playerLoses);
    p.appendChild(bracket);
  }

  buttonPlay.addEventListener('click', () => {
    window.application.moves = 0;
    getGameId();
  });

  const buttonQuit = document.querySelector('.button-quit');

  buttonQuit.addEventListener('click', () => {
    window.application.renderScreen('loginScreen');

    authorize();
  });
}
