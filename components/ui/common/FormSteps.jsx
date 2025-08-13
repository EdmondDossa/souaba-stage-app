"use client";

const FormSteps = ({ stepsLabels:steps, currentStep }) => {
  const width = (1 / steps.length) * 70 + "vw";
  const progressBar = (
    <section className="flex w-full items-center justify-center mt-15">
      {steps.map((step, index) => {
        return (
          <div key={step} className="flex items-center">
            <span
              className={`w-8 h-8 rounded-full border border-black font-montserrat-medium text-center place-content-center block truncate z-10 ${
                currentStep >= index
                  ? "bg-primary border-transparent text-white"
                  : ""
              } `}
            >
              {index + 1}{" "}
            </span>
            <div
              style={{ width: width }}
              className={`relative h-1 text-center  ${
                currentStep >= index ? "bg-primary" : "bg-gray-200"
              } transition-all duration-200`}
            >
              <span className="block text-sm font-montserrat-medium  -translate-y-5">{ step }</span>
            </div>
          </div>
        );
      })}
      <span
        className={`w-8 h-8 rounded-full border border-black font-montserrat-medium text-center place-content-center block truncate ${
          currentStep === (steps.length - 1) ? "bg-primary border-transparent text-white" : ""
        } `}
      >
      </span>
    </section>
  );

  return progressBar;
};

export default FormSteps;
