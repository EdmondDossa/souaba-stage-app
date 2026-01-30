const toDateOnly = (value) => {
  if (!value) return value;
  if (typeof value === "string") {
    if (value.includes("T")) return value.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const buildReservationPayload = (
  pendingReservation,
  guest,
  paymentMethod
) => {
  if (!pendingReservation) return null;

  const payload = {
    checkInDate: toDateOnly(pendingReservation.checkInDate),
    checkOutDate: toDateOnly(pendingReservation.checkOutDate),
    numberOfGuests: Number(pendingReservation.numberOfGuests),
    totalPrice: Number(pendingReservation.totalPrice),
    paymentMethod,
  };

  if (guest && (guest.firstName || guest.lastName || guest.phone || guest.email)) {
    payload.guest = {
      firstName: guest.firstName || undefined,
      lastName: guest.lastName || undefined,
      phone: guest.phone || undefined,
      email: guest.email || undefined,
    };
  }

  if (pendingReservation.type === "accommodation") {
    payload.accommodationId = pendingReservation.accommodationId;
  }

  if (pendingReservation.type === "hotel") {
    payload.rooms = Array.isArray(pendingReservation.rooms)
      ? pendingReservation.rooms
      : [];
  }

  return payload;
};

export const submitReservation = async (
  http,
  pendingReservation,
  guest,
  paymentMethod
) => {
  const payload = buildReservationPayload(
    pendingReservation,
    guest,
    paymentMethod
  );
  if (!payload) return null;

  const res = await http.post("/reservations", payload);
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("pendingReservation");
  }
  return res?.data;
};
