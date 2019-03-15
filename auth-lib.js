/**
 * @typedef {object} UserRecord - Данные пользователя.
 * @property {string} nickname - Имя пользователя.
 * @property {string} password - Пароль пользователя.
 * @property {string[]} groups - Массив групп пользователя.
 */

/**
 * Все пользователи.
 * @type {UserRecord[]}
 */
var allUsers = [
  {
    nickname: "admin",
    password: "1234",
    groups: ["admin", "manager", "basic"]
  },
  {
    nickname: "sobakajozhec",
    password: "sanyok228",
    groups: ["basic", "manager"]
  },
  {
    nickname: "patriot007",
    password: "russiaFTW",
    groups: ["basic"]
  }
];

/**
 * Все права.
 * @type {string[]}
 */
var allRights = ["manage content", "play games", "delete users", "view site"];

/**
 * Все группы.
 * @type {Object.<string, string[]>}
 */
var allGroups = {
  admin: [allRights[2]],
  manager: [allRights[0]],
  basic: [allRights[1], allRights[3]]
};

/**
 * Счетчик групп, увеличивается для каждой созданной группы.
 * @type {number}
 */
var groupCounter = 1;

/**
 * Счетчик прав доступа, увеличивается для каждого созданного права доступа.
 * @type {number}
 */
var rightCounter = 1;

/**
 * Сессия пользователя.
 * @type {string}
 */
var session;

/**
 * Вспомогательная функция для поиска пользователя.
 * @param {string} username
 * @returns {(UserRecord|undefined)}
 */
function findUser(username) {
  return allUsers.filter(function(user) {
    return user.nickname === username;
  })[0];
}

/**
 * Создаёт нового пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {string} Имя созданного пользователя.
 */
function createUser(username, password) {
  if (findUser(username) !== undefined) {
    throw new Error("Пользователь с таким именем уже существует");
  }

  allUsers.push({
    nickname: username,
    password: password,
    groups: ["basic"]
  });

  return username;
}

/**
 * Удаляет пользователя.
 * @param {string} user - Удаляемый пользователь.
 * @returns {undefined}
 */
function deleteUser(user) {
  var userRecord = findUser(user);

  if (userRecord === undefined) {
    throw new Error("Пользователь не найден");
  }

  // Удалить найденного пользователя по индексу из массива
  allUsers.splice(allUsers.indexOf(userRecord), 1);

  return undefined;
}

/**
 * Возвращает массив всех пользователей.
 * @returns {string[]}
 */
function users() {
  return allUsers.map(function(user) {
    return user.nickname;
  });
}

/**
 * Создаёт новую группу пользователей.
 * @returns {string} Созданная группа пользователей.
 */
function createGroup() {
  var groupName = "group" + groupCounter++;

  allGroups[groupName] = [];

  return groupName;
}

/**
 * Удаляет группу пользователей.
 * @param {string} group - Удаляемая группа пользователей.
 * @returns {undefined}
 */
function deleteGroup(group) {
  if (allGroups[group] === undefined) {
    throw new Error("Группа не найдена");
  }

  delete allGroups[group];

  allUsers.forEach(function(user) {
    var userGroupId = user.groups.indexOf(group);

    if (userGroupId !== -1) {
      user.groups.splice(userGroupId, 1);
    }
  });

  return undefined;
}

/**
 * Возвращает массив всех групп пользователей.
 * @returns {string[]}
 */
function groups() {
  return Object.keys(allGroups);
}

/**
 * Добавляет пользователя в группу.
 * @param {string} user - Пользователь, который добавляется в группу.
 * @param {string} group - Группа, в которую добавляется пользователь.
 * @returns {undefined}
 */
function addUserToGroup(user, group) {
  var userRecord = findUser(user);

  if (userRecord === undefined) {
    throw new Error("Пользователь не найден");
  }

  if (allGroups[group] === undefined) {
    throw new Error("Группа не найдена");
  }

  userRecord.groups.push(group);

  return undefined;
}

/**
 * Возвращает группы, в которые входит пользователь.
 * @param {string} user - Пользователь, группы которого запрашиваются.
 * @returns {string[]} Массив групп пользователя.
 */
function userGroups(user) {
  var userRecord = findUser(user);

  if (userRecord === undefined) {
    throw new Error("Пользователь не найден");
  }

  return userRecord.groups;
}

/**
 * Удаляет пользователя из группы.
 * @param {string} user - Пользователь.
 * @param {string} group - Группа.
 * @returns {undefined}
 */
function removeUserFromGroup(user, group) {
  var userRecord = findUser(user);

  if (userRecord === undefined) {
    throw new Error("Пользователь не найден");
  }

  var userGroupId = userRecord.groups.indexOf(group);

  if (userGroupId === -1) {
    throw new Error("Пользователь не входит в группу");
  }

  userRecord.groups.splice(userGroupId, 1);

  return undefined;
}

/**
 * Создаёт новое право.
 * @returns {string} Имя созданного права.
 */
function createRight() {
  // Сформировать уникальное имя для нового права
  var newRight = "right" + rightCounter++;

  allRights.push(newRight);

  return newRight;
}

/**
 * Удаляет право доступа.
 * @param {string} right - Имя удаляемого права.
 * @returns {undefined}
 */
function deleteRight(right) {
  var rightId = allRights.indexOf(right);

  if (rightId === -1) {
    throw new Error("Право не найдено чё ты удаляешь");
  }

  allRights.splice(rightId, 1);

  Object.keys(allGroups).forEach(function(group) {
    var groupRightId = allGroups[group].indexOf(right);

    if (groupRightId !== -1) {
      allGroups[group].splice(groupRightId, 1);
    }
  });

  return undefined;
}

/**
 * Возвращает массив прав группы.
 * @param {string} group - Группа пользователей.
 * @returns {string[]} Массив пользовательских прав указанной группы.
 */
function groupRights(group) {
  if (allGroups[group] === undefined) {
    throw new Error("Группа не найдена");
  }

  return allGroups[group];
}

/**
 * Возвращает массив всех прав пользователей.
 * @returns {string[]}
 */
function rights() {
  return allRights;
}

/**
 * Добавляет право доступа в группу пользователей.
 * @param {string} right - Право доступа.
 * @param {string} group - Группа пользователей.
 * @returns {undefined}
 */
function addRightToGroup(right, group) {
  if (allGroups[group] === undefined) {
    throw new Error("Группа не найдена");
  }

  if (allRights.indexOf(right) === -1) {
    throw new Error("Право не найдено");
  }

  allGroups[group].push(right);

  return undefined;
}

/**
 * Удаляет право из группы.
 * @param {string} right - Право доступа.
 * @param {string} group - Группа пользователей.
 * @returns {undefined}
 */
function removeRightFromGroup(right, group) {
  if (allGroups[group] === undefined) {
    throw new Error("Группа не найдена");
  }

  var groupRightId = allGroups[group].indexOf(right);

  if (groupRightId === -1) {
    throw new Error("Право не входит в группу");
  }

  allGroups[group].splice(groupRightId, 1);

  return undefined;
}

/**
 * Выполняет вход пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль пользователя.
 * @returns {boolean} Результат входа.
 */
function login(username, password) {
  if (session !== undefined) {
    return false;
  }

  var user = allUsers.filter(function(user) {
    return user.nickname === username && user.password === password;
  })[0];

  if (user === undefined) {
    return false;
  }

  session = user.nickname;

  return true;
}

/**
 * Возвращает текущего пользователя.
 * @returns {(string|undefined)}
 */
function currentUser() {
  if (session === undefined) {
    return undefined;
  }

  return session;
}

/**
 * Выполняет выход текущего пользователя.
 * @returns {undefined}
 */
function logout() {
  session = undefined;

  return undefined;
}

/**
 * Проверяет, имеет ли пользователь право.
 * @param {string} user - Пользователь.
 * @param {string} right Право доступа.
 * @returns {boolean} Если имеет право, то true, иначе false
 */
function isAuthorized(user, right) {
  if (typeof user !== "string") {
    throw new Error("Некорректный пользователь");
  }

  if (typeof right !== "string") {
    throw new Error("Некорректное право");
  }

  var userRecord = findUser(user);

  if (userRecord === undefined) {
    throw new Error("Пользователь не найден");
  }

  if (allRights.indexOf(right) === -1) {
    throw new Error("Право не найдено");
  }

  return userRecord.groups.some(function(group) {
    return allGroups[group].indexOf(right) !== -1;
  });
}
