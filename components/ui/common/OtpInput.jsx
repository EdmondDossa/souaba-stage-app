"use client";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";

import React from "react";

const OtpInput = ({ otpLength, otpValue, setOtpValue }) => {
  return (
    <OneTimePasswordField.Root
      value={otpValue}
      validationType="none"
      onValueChange={setOtpValue}
      className="flex gap-2 flex-nowrap"
    >
      {Array.from({ length: otpLength }).map((_, i) => (
        <OneTimePasswordField.Input
          key={i}
          className="box-border inline-flex px-5 h-[50px] w-[50px] rounded-xl appearance-none items-center justify-center p-0 text-[15px] leading-none outline-none selection:bg-blackA6 bg-[#F9F9F9]"
        />
      ))}
    </OneTimePasswordField.Root>
  );
};

export default OtpInput;
