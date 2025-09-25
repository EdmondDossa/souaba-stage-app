"use client";

const FormSteps = ({ steps, currentStep }) => {
  const width = (1 / steps.length) * 60 + "vw";
  const progressBar = (
    <section className="flex w-full items-center justify-center">
      {steps.map((step, index) => {
        return (
          <div key={step.name} className="flex items-center">
            <div
              className={`relative h-1 text-center mx-0.5 rounded-sm w-[40px] ${
                currentStep >= index ? "bg-primary" : "bg-gray-300"
              } ${
                currentStep === index
                  ? "-animate-[bounce_600ms_linear_infinite]"
                  : ""
              } `}
            ></div>
          </div>
        );
      })}
    </section>
  );
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h4 className="font-montserrat-bold text-lg"> {steps[currentStep].name} </h4>
      <span className="font-montserrat-medium mb-4 block">
        Etape {currentStep+1}/{steps.length}
      </span>
      {progressBar}
    </div>
  );
};

export default FormSteps;
