"use client";

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../app/axios/instance"; // Импортируем axiosInstance
import ReactMarkdown from 'react-markdown';

type Message = {
  id: number;          // Уникальный идентификатор сообщения
  user_message?: string; // Сообщение пользователя (опционально)
  bot_reply?: string;    // Ответ бота (опционально)
  user_id: number;       // Идентификатор пользователя
  created_at?: string;   // Дата создания сообщения (опционально)
};

export default function Chat() {
  const [prompt, setPrompt] = useState<string>(""); // Стейт для хранения ввода пользователя
  const [messages, setMessages] = useState<Message[]>([]); // Сообщения
  const lastMessageRef = useRef<HTMLDivElement>(null); // Реф для последнего сообщения
  const fileInputRef = useRef<HTMLInputElement>(null); // Реф для файла

  // Получение истории сообщений при первой загрузке
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get("/messages");
        setMessages(response.data); // Обновляем стейт с историей сообщений
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  // Прокрутка к последнему сообщению при изменении массива сообщений
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePromptSend = async () => {
    if (prompt.trim()) {
      const newMessage: Message = {
        id: Date.now(), // Генерация ID
        user_message: prompt,
        user_id: 1, // Идентификатор для пользователя
        created_at: new Date().toISOString(), // Устанавливаем текущее время
      };

      // Локальное обновление чата сразу с сообщением пользователя
      setMessages((prev) => [
        ...prev,
        newMessage, // Добавляем сообщение от пользователя
      ]);

      try {
        const response = await axiosInstance.post("/chatbot", newMessage);
        let botReply: string = response.data.bot_reply;

        // Обновляем состояние с ответом бота с задержкой
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1, // Генерируем уникальный ID для сообщения от бота
              bot_reply: botReply,
              user_id: 2, // Идентификатор для бота
              created_at: new Date().toISOString(), // Устанавливаем текущее время
            },
          ]);
        }, 500); // Устанавливаем задержку перед добавлением ответа бота

        setPrompt(""); // Очистка поля ввода
      } catch (error) {
        console.error("Error sending message:", error);
        // Можно добавить уведомление об ошибке для пользователя
      }
    }
  };

  // Обработка нажатия клавиши Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Отключение переноса строки по Enter
      handlePromptSend(); // Отправка сообщения
    }
  };

  // Обработка загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file);
      // Дополнительная логика обработки загруженного файла
      // Например, можно отправить его на сервер или сохранить в стейт
    }
  };

  return (
    <div className="form max-w mx-auto rounded-lg flex flex-col h-[91.5vh] relative mt-[-40px]">
      {/* Чат-сообщения */}
      <div className="bg-gray-200 px-[10%] py-5 pb-[100px] rounded-md shadow-md flex-grow overflow-y-auto h-[60%]">
        {messages.map((msg, index) => (
          <div key={index}>
            {/* Сообщение от пользователя */}
            {msg.user_message && (
              <div className="flex justify-end mb-4">
                <div className="px-4 py-2 rounded-lg max-w-[60%] bg-green-600 text-white">
                  <ReactMarkdown>{msg.user_message}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Ответ от бота */}
            {msg.bot_reply && (
              <div className="flex justify-start mb-4">
                <div className="px-4 py-2 rounded-lg max-w-[60%] bg-gray-700 text-gray-200">
                  <ReactMarkdown>{msg.bot_reply.replace(/12345678!!!/g, "").trim()}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Реф для последнего сообщения */}
        <div ref={lastMessageRef}></div>
      </div>

      {/* Текстовое поле и кнопка */}
      <div className="absolute bottom-0 left-0 right-0 px-[5px] pb-[50px] bg-gray-200 flex items-center justify-center w-full">
        <div className="w-[90%] flex items-center justify-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown} // Обработка нажатия Enter
            className="flex-grow p-2 border border-gray-300 rounded-md resize-none shadow-sm textarea textarea-success sm:text-sm mr-2"
            rows={1}
            placeholder="Write your prompt here..."
          ></textarea>
          <div className="relative">
            <input
              type="file"
              onChange={handleImageUpload} // Обработка загрузки файлов
              ref={fileInputRef} // Связываем реф с инпутом
              className="absolute opacity-0 cursor-pointer w-full h-full"
              style={{ display: 'none' }} // Скрываем input
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()} // Открытие диалога выбора файла
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-500 flex justify-center align-center mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="fill-white w-[25px]"
              >
                <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={handlePromptSend}
            className="px-4 py-[10px] bg-green-600 text-white flex justify-center align-center hover:bg-green-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="fill-white w-[25px]"
            >
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.5l-65.5-32.8c-8.4-4.2-14-12.3-16-21.1l-29-129.5-129.4 29c-8.8 1.9-16.9-1.5-21.1-9.9-4.2-8.4-1.7-18.5 5.3-25.1l107.4-101.7L6.1 21.9C-3.6 12.2.7 0 10.1 0h480c10.2 0 18.8 8.4 18.8 18.7 0 2.3-.4 4.6-1.2 6.7-2.6 8.7-7.9 15.5-14.6 19.8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
