#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Деплой на Beget${NC}\n"

# Данные для подключения
SSH_USER="vlelikkh_"
SSH_HOST="vlelikkh.beget.tech"
REMOTE_PATH="plumberdonetsk.ru/public_html"

# Шаг 1: Локальная сборка
echo -e "${BLUE}📦 Шаг 1: Сборка проекта локально${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при сборке проекта${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Проект собран${NC}\n"

# Шаг 2: Очистка старых файлов на сервере
# echo -e "${BLUE}🗑️  Шаг 2: Очистка старых файлов на сервере${NC}"
# echo -e "${YELLOW}Введите пароль: ${NC}"

#ssh ${SSH_USER}@${SSH_HOST} "rm -rf ${REMOTE_PATH}/* && mkdir -p ${REMOTE_PATH}"

#if [ $? -ne 0 ]; then
 #   echo -e "${RED}❌ Ошибка при очистке сервера${NC}"
  #  exit 1
#fi

#echo -e "${GREEN}✅ Старые файлы удалены${NC}\n"

# Шаг 3: Загрузка новых файлов
echo -e "${BLUE}📤 Шаг 3: Загрузка файлов на сервер${NC}"
echo -e "${YELLOW}Введите пароль еще раз: ${NC}"

scp -r dist/* ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при загрузке файлов${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Файлы загружены${NC}\n"

# Шаг 4: Копирование .htaccess
echo -e "${BLUE}⚙️  Шаг 4: Копирование .htaccess${NC}"
echo -e "${YELLOW}Введите пароль последний раз: ${NC}"

scp .htaccess.example ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/.htaccess

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при копировании .htaccess${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .htaccess скопирован${NC}\n"

# Готово!
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Деплой успешно завершен!${NC}"
echo -e "${GREEN}🌐 Проверьте сайт: http://plumberdonetsk.ru${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"



