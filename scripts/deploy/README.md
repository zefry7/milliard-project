# Автоматическое выливание сборки

Сборка запускается при push'е в ветку dev или master.

Папка `\\diskstation\web\dev` смонтированна в папку `/mnt/diskstation/web/dev`

## Параметры 

Параметры можно передать через переменные окружения, задаваемые в `Settings >> CI/CD >> Variables`, при этом ключи должны иметь следующий формат `${ветка}__deploy_${параметр}` (e.g.: **dev__deploy_type**), либо через аргументы при вызове задачи (e.g.: **gulp deploy --type=ftp**)

 * type - протокол выгрузки ftp, sftp или local
 * dir - путь для выливания
 * host - адрес подключения для ftp/sftp
 * port - порт подключения, стандартные (21,22) можно не указывать
 * user/login - ftp/sftp логин
 * pass/password - ftp/sftp пароль
 * passphrase - пароль для ssh ключа (\\diskstation\project_mats\security\keys\peppers_rsa_openssh), пока не используется