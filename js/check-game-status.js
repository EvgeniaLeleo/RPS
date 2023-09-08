function checkGameStatus() {
  const params = new URLSearchParams();

  params.append('token', window.application.token);
  params.append('id', window.application.gameId);

  httpRequest({
    url: '/game-status',
    params,
    onSuccess: getStatus,
  });

  function getStatus(userData) {
    if (userData['message'] === 'no game id') {
      console.log('Id игры не передан');
    }

    if (userData['message'] === 'wrong game id') {
      console.log('Id игры некорректный / бой не существует / бой закончен');
    }

    if (userData['message'] === `token doesn't exist`) {
      console.log('Нет игрока с таким токеном');
    }

    if (userData['message'] === 'player is not in this game') {
      console.log('Игрок не в этой игре');
    }

    if (userData['game-status']['status'] === 'waiting-for-your-move') {
      window.application.renderScreen('moveScreen');

      const enemyName = document.querySelector('.enemy-name');

      if (window.application.moves === 0) {
        enemyName.textContent = `Вы против ${userData['game-status']['enemy']['login']}`;
      } else {
        enemyName.textContent = `Вы и ${userData['game-status']['enemy']['login']} сделали одинаковые ходы. Попробуйте еще раз!`;
      }

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
}
