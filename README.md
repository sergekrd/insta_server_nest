# Backend для автоматизации запрещенной сети (NestJS проект)

Этот проект представляет собой backend-часть для автоматизации действий в запрещенной сети, используя библиотеку instagram-private-api. Он предоставляет ряд маршрутов для управления сессиями, авторизацией и выполнением действий в Instagram.

Установка
Склонируйте репозиторий:

```
git clone <URL репозитория>
cd <название проекта>
```

Установите зависимости:
`npm install`

в env файле пропишите строку подключения к postgres.
мигрируйте таблицы
`npx prisma migrate dev`

Запустите проект:
`npm run start`

### Маршруты API

Авторизация (/login)
Метод: POST

Этот маршрут используется для авторизации пользователя в Instagram.

Параметры запроса
password (string): Пароль пользователя в Instagram.
username (string): Имя пользователя в Instagram.
proxyString (string): Необязательный параметр. Строка прокси для использования при авторизации.

Подтверждение кода (/checkpointcode)
Метод: POST

Этот маршрут используется для подтверждения кода безопасности (например, при двухфакторной аутентификации) в Instagram.

Параметры запроса
username (string): Имя пользователя в Instagram.
code (string): Код безопасности для подтверждения аккаунта.

Выполнение действий (/execute)
Метод: POST

Этот маршрут используется для выполнения переданных в теле запроса функций из in***am-private-api.

Тело запроса
Ожидается JSON-объект с данными, соответствующими требованиям in***am-private-api для выполнения действий.

`const body = { function: insta.getMediaLikers.toString(), username: **autorized_username**, args };`

```
 getMediaInfo = async (ig: IgApiClient, args: any): Promise<MediaInfoResponseRootObject> => {
    try {
      const { mediaId } = args;
      const result = await ig.media.info(mediaId);
      return result;
    } catch (e) {
      throw e;
    }
  };
```

## Общая информация

Проект создан для ознакомления с возможностями in***am-private-api. Так как запрещенная сеть не приветствует частые авторизации, этот сервис создает и хранит сессии для последующего использования.
