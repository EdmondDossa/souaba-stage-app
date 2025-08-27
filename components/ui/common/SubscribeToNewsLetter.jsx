import { LuSendHorizontal } from "react-icons/lu";

const SubscribeToNewsLetter = () => {
  return (
    <section className="flex items-center justify-center gap-x-5 bg-[#E8EAEC] px-3 py-8">
      <div>
        <strong className="text-3xl text-gray-600 font-montserrat-bold block">
          NEWSLETTER
        </strong>
        <span className="text-sm text-gray-700 font-montserrat-medium block">
          Restez à jour
        </span>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="text-md text-gray-600 block min-w-4xl border border-gray-300 bg-white rounded-3xl px-5 py-3 ring-1 ring-gray-200 focus:outline-0 focus:ring-primary outline-none"
          placeholder="Votre e-mail ..."
        />
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center -translate-x-7 hover:scale-105 transition cursor-pointer">
          {" "}
          <button>
            <LuSendHorizontal className="text-white text-2xl" />{" "}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscribeToNewsLetter;
