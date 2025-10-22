"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Button } from "@/components/ui/common";
import { useRouter, useSearchParams } from "next/navigation";
import Wrapper from "./ui/Wrapper";
import toast from "react-hot-toast";
import getAxiosInstance from "@/lib/request";
import FormSteps from "@/components/ui/common/FormSteps";
import {
  IdentityCard,
  Hebergement,
  Commodities,
  Equipements,
  PropertyInformations,
  Security,
  Resume,
  SuccessfulSubmit,
  HotelsRoom,
} from "@/app/(main)/(protected)/add-establishment/steps-components";
import useAuthContext from "@/context/auth";
import ErrorModal from "@/components/ui/common/ErrorModal";
import SetProfileInfoForAccomodation from "../../set-profile-info/page";

const rawSteps = [
  {
    name: "Hébergement",
    component: Hebergement,
  },
  {
    name: "Informations",
    component: PropertyInformations,
  },
  {
    name: "Chambres",
    component: HotelsRoom,
  },
  {
    name: "Equipements",
    component: Equipements,
  },
  {
    name: "Commodités",
    component: Commodities,
  },
  {
    name: "Sécurités",
    component: Security,
  },
  {
    name: "Résumé",
    component: Resume,
  },
];

const identitySection = {
  name: "Pièce d'identité",
  component: IdentityCard,
};

const AddEstablishment = () => {
  const http = getAxiosInstance();
  const router = useRouter();
  const { user } = useAuthContext();
  
  const stepsDefinitions = [
    ...rawSteps,
    ...(user.profile?.identity_document ? [] : [identitySection]),
  ];

  const searchParams = useSearchParams();
  const forTestingPurpose = searchParams.get("env") === "test";

  const [steps, setSteps] = useState(stepsDefinitions);
  const stepsLabels = steps.map((step) => step.name);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setSubmitted] = useState(false);

  const [submissionError, setSubmissionError] = useState("");

  const [stepFormValues, setStepFormValues] = useState(() =>
    stepsDefinitions.map((step) => ({
      stepName: step.name,
      data: null,
      allowNextStep: false,
    }))
  );

  const locate = (step) => step.stepName === stepsLabels[currentStep];

  //when the hebergement type choosen is Hôtel we have one extra step to manage infos about rooms type
  //by default the hebergement type is hôtel so we have to look at changes in order to update the steps components

  const hebergementType = stepFormValues.find(
    (step) => step.stepName === "Hébergement"
  ).data;

  if (!user.profile?.city) return <SetProfileInfoForAccomodation />

  useEffect(() => {
    if (!hebergementType) return;
    if (hebergementType === "Hôtel") setSteps(stepsDefinitions);
    else {
      //when it is `Hôtel` as hebergement then retrieve the roomtype component step
      setSteps(stepsDefinitions.filter((step) => step.name !== "Chambres"));
    }
  }, [hebergementType]);

  function handleFormDataUpdate(data) {
    let formDataCopy = Array.from(stepFormValues);
    const index = formDataCopy.findIndex(locate);
    formDataCopy[index].data = data;
    setStepFormValues(formDataCopy);
  }

  function allowNextStep(isAllowed = true) {
    let formDataCopy = Array.from(stepFormValues);
    const index = formDataCopy.findIndex(locate);
    formDataCopy[index].allowNextStep = isAllowed;
    setStepFormValues(formDataCopy);
  }

  function renderStepComponentWithData(CurrentStepComponent) {
    if (!CurrentStepComponent) return <></>;
    //we can only rely on the step label as state identifier since the index of steps in the array can change anytime
    const stepValue = stepFormValues.find(locate).data;
    return (
      <CurrentStepComponent
        formValues={stepFormValues} // in case a step need the state of others steps
        setCurrentStep={setCurrentStep} // only useful for resume step
        handleFormDataUpdate={handleFormDataUpdate} //update the global state of the data
        initialState={stepValue} //the state the current step
        allowNextStep={allowNextStep} // control either access or rejection to next step
      />
    );
  }

  async function goToNextStep() {
    const index = stepFormValues.findIndex(locate);
    if (stepFormValues[index].allowNextStep)
      setCurrentStep(Math.min(currentStep + 1, stepsLabels.length - 1));
    else {
      toast.error(
        "Des informations requises sur cette page sont manquantes pour continuer."
      );
      return;
    }

    //on the last step we have to publish
    if (currentStep === stepsLabels.length - 1) {
      toast.loading("Publication");

      console.log(stepFormValues);
      
      //type information
      try {
        let { formContent, photos } = stepFormValues.find(
          (item) => item.stepName === "Informations"
        )?.data;

        const amenities = stepFormValues.find(
          (item) => item.stepName === "Commodités"
        )?.data;

        const securities = stepFormValues.find(
          (item) => item.stepName === "Sécurités"
        )?.data;

        const roomData =
          stepFormValues.find((item) => item.stepName === "Chambres")?.data;

        const roomInfo = roomData?.formContent ?? {};
        const roomPhotos = roomData?.photos ?? [];

        let fileData = new FormData();
        for (let i = 0; i < photos.length; i++) {
          fileData.append("files", photos[i].file);
        }
        fileData.append("mediaType", "IMAGE");

        //handle images upload
        let response = await http.post("/uploads/multiple", fileData);

        const uploaded_images = response.data.map((uploadedFile, i) => ({
          media_type: uploadedFile.media_type,
          media_id: uploadedFile.media_id,
          is_primary: i === 0,
        }));

        //rooms categories
        fileData = new FormData();
        for (let i = 0; i < roomPhotos.length; i++) {
          fileData.append("files", roomPhotos[i].file);
        }
        fileData.append("mediaType", "IMAGE");

        const formInfo = {
          name: formContent.name,
          description: formContent.description,
          address: formContent.address,
          city: formContent.city,
          country: formContent.country,
          district:formContent?.disctrict ?? "NA",
          google_maps_location: formContent.map,
          email: user.email,
          phone: user.profile.contact ?? user.profile.phone,
          booking_and_cancellation_policy:
            "Free cancellation up to 24 hours before check-in",
          amenities,
          uploaded_images,
        };

        let requestUrl = "/partners/become-accommodation";

        if (hebergementType === "Hôtel") {
          response = await http.post("/uploads/multiple", fileData);
          const room_uploaded_images = response.data.map((uploadedFile, i) => ({
            media_type: uploadedFile.media_type,
            is_primary: i === 0,
            media_id: uploadedFile.media_id,
          }));

          const room = {
            amenities,
            securities,
            name: roomInfo.room_name,
            type: "STANDARD",
            number_of_rooms: +roomInfo.room_type_number,
            room_type: roomInfo.room_type,
            price_per_night: +roomInfo.room_price_per_night,
            number_of_bathrooms: +roomInfo.number_of_bathrooms,
            capacity: +roomInfo.capacity_acc,
            description: roomInfo.description_rooms,
            uploaded_images: room_uploaded_images,
          };

          formInfo["room_categories"] = [room];
          requestUrl = "/partners/become-hotel";
        }else{
          //type de chambre
          const roomTypeMatchers = {
            "Résidence":"RESIDENCE",
            "Appartement":"APARTMENT",
            "Villa":"VILLA",
            "Studio":"STUDIO"
          };

          formInfo.type = roomTypeMatchers[hebergementType];

          //securities
          formInfo.securities = securities;

          //equipements
          const equipements = stepFormValues.find(
            (item) => item.stepName === "Equipements"
          )?.data;
          formInfo.number_of_bathrooms = +equipements.bathrooms;
          formInfo.number_of_rooms = +equipements.rooms;
          formInfo.number_of_parking = +equipements.parking;

          //rooms information
          formInfo.area = formContent.area;
          formInfo.price_per_night = +formContent.price_per_night;
          formInfo.capacity = +formContent.capacity;
          formInfo.check_in_time = new Date().getDate().toString();
          formInfo.check_out_time = new Date().getDate().toString();

          formInfo.rules = [
            "Interdiction de fumer à l'intérieur.",
            "Aucune fête ni événement sans autorisation.",
            "Les animaux domestiques sont autorisés sur demande.",
            "Le silence est demandé entre 22h00 et 7h00.",
            "Tout dommage devra être signalé immédiatement.",
            "Respectez les voisins et les autres voyageurs.",
            "Aucune bougie ni flamme nue à l'intérieur.",
            "Le check-in s’effectue à partir de 15h00, check-out avant 11h00.",
            "Ne laissez pas la climatisation ou les lumières allumées en quittant.",
            "Utilisez les poubelles de tri pour les déchets recyclables."
          ];
          
        }

        //update user profile with identity_card if not already set
        if (!user.profile?.identity_document) {
          const card = stepFormValues.find(
            (item) => item.stepName === "Pièce d'identité"
          ).data;
          const fileData = new FormData();

          fileData.append(
            "identity_document",
            card["identity-card-recto"].file
          );
          // fileData.append("mediaType", "IMAGE");
          // const response = await http.post("/uploads/multiple", fileData);
          // const identity_document = response.data[0].media_id;
          const res = await http.patch("/users/profile", fileData);
        }
          console.log(formInfo);
          
        await http.post(requestUrl, formInfo);
        setSubmitted(true);
      } catch (error) {
        if (error.status === 409) {
          setSubmissionError(
            "Une demande est déjà en attente d'examen. Vous pourrez faire une demande si l'autre est approuvée"
          );
        } else if (error.status === 403) {
          setSubmissionError(
            "Nombre maximal de tentatives atteint (3/3). Votre compte a été bloqué. Veuillez contacter le support."
          );
        } else if (error.status === 400) {
          setSubmissionError(
            "Une erreur est survenue. Veuillez patientez avant de soumettre une nouvelle requête!"
          );
        } else {
          setSubmissionError(
            "Votre demande a échoué.Veuillez réessayer plus tard. Merci."
          );
          console.log(error);
        }
        toast.error("Une erreur est survenue lors de l'enrégistrement!");
      } finally {
        toast.dismiss();
      }
    }
  }

  const onModalErrorClose = () => setSubmissionError("");

  useEffect(() => {
    //to make sure the top of each new component is in view - ie reset scroll position
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  return isSubmitted ? (
    <SuccessfulSubmit />
  ) : (
    <section>
      <FormSteps steps={steps} currentStep={currentStep} />
      <section className="w-full md:w-[90%] mx-auto mt-2">
        <Wrapper
          fullWidth={["Hébergement", "Commodités", "Sécurités"].includes(
            stepsLabels[currentStep]
          )}
          withBorder={["Equipements", "Résumé"].includes(
            stepsLabels[currentStep]
          )}
        >
          {/* Current steps components */}
          <div className="w-full p-4 mb-4">
            {renderStepComponentWithData(steps[currentStep]?.component)}
          </div>
          <div className={`flex justify-between w-[95%] mx-auto`}>
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="secondary"
              size="lg"
              className={`font-montserrat-medium border border-gray-300 cursor-pointer hover:bg-white hover:text-black bg-white group rounded-lg ${
                currentStep === 0 ? "invisible" : "visible"
              }`}
            >
              <FaChevronLeft className="group-hover:-translate-x-1.5 transition-all ease-in" />{" "}
              Retour
            </Button>
            <Button
              onClick={goToNextStep}
              size="lg"
              className="font-montserrat-medium font-bold rounded-lg bg-primary py-3 hover:bg-primary/80 cursor-pointer"
            >
              {/* check if it is the last step */}
              {currentStep === stepsLabels.length - 1 ? "Publier" : "Suivant"}
            </Button>
          </div>
        </Wrapper>
      </section>
      {submissionError && (
        <div className="fixed inset-0 bg-gray-900/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ErrorModal onClose={onModalErrorClose} message={submissionError} />
        </div>
      )}
    </section>
  );
};

export default AddEstablishment;
