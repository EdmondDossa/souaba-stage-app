import SuccessfulSubmit from "@/components/ui/common/SuccessfulSubmit";

const SuccessfulSubmitted = () => {
  return (
    <SuccessfulSubmit
      withLinkToHome={true}
      title="Merci pour votre soumission."
    >
      Nous avons bien reçu les informations de la propriété que vous souhaitez
      héberger ainsi que votre pièce d'identité. Vous recevrez un email de
      confirmation d'ici peu pour l'activation de votre compte partenaire.
    </SuccessfulSubmit>
  );
};

export default SuccessfulSubmitted;
