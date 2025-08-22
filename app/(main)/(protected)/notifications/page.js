"use client";
import { BellOff, X } from "lucide-react";
import React, { useState } from "react";

const Notifications = () => {
  let dumpNotifications = [
    {
      titre: "Invitez vos amis!",
      date: "12 mars 2027",
    },
    {
      titre: "Connectez-vous à votre compte facebook",
      date: "14 avril 2022",
    },
    {
      titre: "Nouvelle alerte de confidentialité!",
      date: "08 juillet 2015",
    },
  ];

  const [notifications, setNotifications] = useState(dumpNotifications);

  function retrieveNotification(titre) {
    const filteredNotifications = notifications.filter(
      (notification) => notification.titre !== titre
    );
    setNotifications(filteredNotifications);
  }

  return (
    <div>
      <section className="max-w-2xl md:max-w-4xl border mx-auto mt-10 border-gray-200 rounded-xl">
        <div className="bg-gray-950 rounded-t-xl text-white py-5 px-4 w-full">
          <h1 className="text-lg md:text-xl font-montserrat-bold px-4">
            {" "}
            Toutes les notifications{" "}
          </h1>
        </div>
        <article
          className={`px-5 min-h-44 ${
            notifications.length === 0
              ? " flex flex-col justify-center items-center"
              : ""
          }`}
        >
          {notifications.map((notification, i) => {
            return (
              <div
                key={notification.date}
                className={`flex justify-between text-md items-center p-3  ${
                  i < notifications.length - 1
                    ? "border-b border-b-gray-200"
                    : ""
                }`}
              >
                <div>
                  <h2 className="font-montserrat-medium font-bold">
                    {" "}
                    {notification.titre}{" "}
                  </h2>
                  <p className="text-gray-400"> {notification.date} </p>
                </div>
                <div>
                  <X
                    onClick={() => retrieveNotification(notification.titre)}
                    className="text-gray-400 hover:text-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="flex items-center  justify-center gap-x-2 text-gray-400 font-sans text-lg">
              {" "}
              <BellOff  /> Aucune notification pour le moment.{" "}
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default Notifications;
