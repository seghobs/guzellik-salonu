import { getSalon, getPersonelById, getRandevular } from "../db";

const DAYS_TR: { [key: number]: string } = {
  0: "pazar",
  1: "pazartesi",
  2: "sali",
  3: "carsamba",
  4: "persembe",
  5: "cuma",
  6: "cumartesi",
};

export interface TimeSlot {
  saat: string;
  musait: boolean;
}

export async function calculateAvailableSlots(
  tarih: string, // YYYY-MM-DD
  personelId: string
): Promise<TimeSlot[]> {
  const dateObj = new Date(tarih);
  if (isNaN(dateObj.getTime())) {
    return [];
  }

  const dayOfWeekNum = dateObj.getDay();
  const dayNameTr = DAYS_TR[dayOfWeekNum];

  // 1. Get Salon Info and Check Working Hours
  const salon = await getSalon();
  const salonDaySettings = salon.calisma_saatleri[dayNameTr];
  if (!salonDaySettings || !salonDaySettings.acik || !salonDaySettings.baslangic || !salonDaySettings.bitis) {
    return []; // Salon is closed
  }

  // 2. Get Staff Info and Check Working Days
  const staff = await getPersonelById(personelId);
  if (!staff || !staff.aktif || !staff.musait_gunler.includes(dayNameTr)) {
    return []; // Staff doesn't work today
  }

  // 3. Generate hourly slots
  const slots: TimeSlot[] = [];
  const startHour = parseInt(salonDaySettings.baslangic.split(":")[0]);
  const endHour = parseInt(salonDaySettings.bitis.split(":")[0]);

  // Fetch all appointments for that staff on that date
  const appointments = await getRandevular();
  const activeBookings = appointments.filter(
    (r) =>
      r.personel_id === personelId &&
      r.tarih === tarih &&
      r.durum !== "reddedildi" &&
      r.durum !== "iptal"
  );

  for (let hour = startHour; hour < endHour; hour++) {
    const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
    
    // Check if slot overlaps with an existing appointment
    const isBooked = activeBookings.some((b) => b.baslangic_saati === formattedHour);

    slots.push({
      saat: formattedHour,
      musait: !isBooked,
    });
  }

  return slots;
}
