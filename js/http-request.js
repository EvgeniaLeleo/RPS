/**Функция принимает URL бэкенда (например, '/login'), GET-параметры в виде объекта { ключ: значение } и callback, который будет вызван с передачей туда данных ответа. */

function httpRequest({ url, params, onSuccess }) {
  const request = new XMLHttpRequest();

  request.open(
    'GET',
    `https://skypro-rock-scissors-paper.herokuapp.com${url}?${params.toString()}`
  );

  request.responseType = 'json';

  request.send();

  request.addEventListener('load', () => {
    if (request.status === 200) {
      onSuccess(request.response);
    } else {
      onError(request.response || 'Неизвестная ошибка');
    }
  });

  request.addEventListener('error', (errorMessage = 'Сеть недоступна') => {
    console.log(errorMessage);
  });
}
