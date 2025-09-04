import InformationsForm from "./InformationsForm";
import { CountrySelect, Input, Label } from "../ui";
import PhotosUpload from "./PhotosUpload";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const HomeTypeDetails = ({
  bannerImg,
  formStepTitle,
  formLayout,
  initialState,
  allowNextStep,
  handleFormDataUpdate,
}) => {
  //we need to know every field in advance to validate the form before next step so we can ensure that all required field is filled
  //since this form won't be submitted as accustomed will do that on a controlled manner
  const allFieldsName = [
    ...formLayout.top?.fields?.map((field) => field.name),
    ...formLayout.middle?.fields?.map((field) => field.name),
    ...formLayout.bottom?.fields?.map((field) => field.name),
  ];

  //will create an object key:value with all field name set to ""
  const formEmptyState = Object.fromEntries(
    allFieldsName.map((name) => [name, ""])
  );

  const [previewPhotos, setPreviewPhotos] = useState(
    initialState?.photos || []
  );

  const [formContent, setFormContent] = useState(initData);

  const [formContentError, setFormContentError] = useState({});

  const formProps = {
    handleFormInput,
    formContent,
    formContentError,
    onError: addFormError,
  };

  useEffect(() => {
    verifyAvailabilityForNextStep();
  }, [
    JSON.stringify(formContent),
    JSON.stringify(formContentError),
    previewPhotos.length,
  ]);

  useEffect(() => {
    //update the state in the parent component
    handleFormDataUpdate({ formContent, photos: previewPhotos });
  }, [JSON.stringify(formContent)]);

  return (
    <InformationsForm formStepTitle={formStepTitle} bannerImg={bannerImg}>
      <div
        className={
          formLayout.top.disposition === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 mb-6 gap-x-4 grid-"
            : "flex flex-col mb-6"
        }
      >
        <FormSection {...formProps} fields={formLayout.top.fields} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-6">
        <FormSection {...formProps} fields={formLayout.middle.fields} />
      </div>

      <div>
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4">
          <PhotosUpload
            onPhotosChange={handlePhotosChange}
            displayPhotos={initialState?.photos}
          />
          <div className="[&_div]:mb-5 w-full md:w-1/2 space-y-4">
            <FormSection {...formProps} fields={formLayout.bottom.fields} />
          </div>
        </div>
      </div>
      {/* when top form disposition is grid then it means that we want to render room form */}
      {formLayout.top.disposition === "grid" && (
        <div className="mt-12 mx-auto flex items-center justify-center">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex gap-x-3 text-white font-montserrat-medium bg-primary hover:bg-primary/85 rounded-lg p-3"
          >
            <Plus /> Ajouter un type de chambre
          </button>
        </div>
      )}
    </InformationsForm>
  );

  function initData() {
    //this component reflect the state of two components conditionnaly ie-hotels and property informations
    //since there is some attributes that are not shared between the two components we should remove them from the initial state
    //to avoid blocking allowedNextStep and add attributes that are not commons
    if (!initialState?.formContent) return formEmptyState;
    let actualState = { ...initialState.formContent };
    for (const key of Object.keys(initialState?.formContent)) {
      if (!allFieldsName.includes(key)) delete actualState[key];
    }
    return { ...formEmptyState, ...actualState };
  }

  function handleFormInput(e) {
    const { name, value } = e.target;
    setFormContent({ ...formContent, [name]: value });
  }

  function addFormError(field) {
    const error = validator(field);
    setFormContentError({ ...formContentError, [field.name]: error });
  }

  function handlePhotosChange(photos) {
    handleFormDataUpdate({ formContent, photos });
    setPreviewPhotos(photos);
  }

  function verifyAvailabilityForNextStep() {
    const everyFieldHasContent = Object.values(formContent).every(Boolean);
    const isFormContentError = Object.values(formContentError).some(Boolean);
    const imagesHasBeenUploaded = previewPhotos.length > 0;
    if (everyFieldHasContent && imagesHasBeenUploaded && !isFormContentError)
      allowNextStep();
    else allowNextStep(false);
  }

  function validator(field) {
    if (field?.type === "number" && !Number(formContent[field.name])) {
      return "Ce champ requiert une valeur numérique!";
    }

    if (!formContent[field.name]) {
      return "Ce champ est requis!";
    }

    if (field?.type === "text" && formContent[field.name].length < 3) {
      return "3 caractères au moins!";
    }
    return "";
  }
};

function FormSection({
  fields,
  handleFormInput,
  formContent,
  formContentError,
  onError,
}) {
  return fields.map((field) => (
    <div
      className={`mb-3 ${field.type === "textarea" ? "col-span-full" : ""} `}
      key={field.name}
    >
      <Label id={field.name} displayName={field.label} />
      {field.type === "select" ? (
        <CountrySelect
          value={formContent[field.name]}
          onChange={handleFormInput}
        />
      ) : (
        <Input
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          onChange={handleFormInput}
          error={formContentError[field.name]}
          value={formContent[field.name]}
          onBlur={() => onError(field)}
        />
      )}
    </div>
  ));
}

export default HomeTypeDetails;
