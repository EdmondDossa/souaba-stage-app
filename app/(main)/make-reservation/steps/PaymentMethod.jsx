"use client";

import { RadioGroup } from "radix-ui";
import { Button } from "@/components/ui/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Wallet, Coins, AlertTriangle } from "lucide-react";

const paymentMethods = [
  {
    type: "WALLET",
    label: "GeniusPay – Portefeuille",
    description: "Paiement instantané via GeniusPay (carte, mobile money, wallet).",
    icon: <Wallet size={24} className="text-primary" />,
  },
  {
    type: "CASH",
    label: "Espèces",
    description:
      "La réservation est validée après réception du paiement en main propre.",
    icon: <Coins size={24} className="text-primary" />,
  },
];

const PaymentMethod = ({ goToNextStep, setFormValues, formValues }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const handleValueChange = (value) => {
    setFormValues((prev) => ({ ...prev, paymentMethod: value }));
    params.set("payment", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="flex flex-col justify-between items-center w-full md:border md:border-gray-200 px-4 sm:px-6 md:px-10 text-sm relative">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-600 mt-2 md:mt-10 font-montserrat-bold mb-6 sm:mb-8">
          Méthodes de paiement
        </h1>

        <RadioGroup.Root
          onValueChange={handleValueChange}
          defaultValue={formValues["paymentMethod"]}
        >
          {paymentMethods.map((method) => (
            <label
              htmlFor={method.type}
              key={method.type}
              className="cursor-pointer"
            >
              <div className="mb-2 font-bold text-gray-900 font-montserrat-medium">
                {method.label}
              </div>
              <div className="flex justify-between items-center px-4 py-3 w-full space-x-4 border border-gray-200 rounded-xl mb-7">
                <span className="flex items-center gap-x-4 font-bold text-gray-600">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {method.icon}
                  </span>
                  <span className="text-sm text-gray-600">{method.description}</span>
                </span>
                <div>
                  <RadioGroup.Item
                    id={method.type}
                    name={method.type}
                    className="size-[25px] border border-primary cursor-pointer rounded-full bg-white outline-none"
                    value={method.type}
                  >
                    <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[12px] after:rounded-full after:bg-primary" />
                  </RadioGroup.Item>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup.Root>
        <div className="flex gap-x-3 text-[12px] text-gray-800 italic font-bold">
          <div>
            <AlertTriangle size={16} className="text-primary" />
          </div>
          Tant que le paiement en espèces n'est pas effectué, la réservation
          n'est pas garantie.
        </div>
      </div>
      <div className="mt-10 sm:mt-16 align-bottom self-end w-full place-content-end">
        <Button
          onClick={goToNextStep}
          className="w-full max-w-[560px] mx-auto bg-primary hover:bg-amber-400! py-3 font-montserrat-bold rounded-lg mb-5"
        >
          Continuer
        </Button>
      </div>
    </section>
  );
};

export default PaymentMethod;
