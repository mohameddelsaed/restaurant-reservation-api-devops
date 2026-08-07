import { Injectable } from '@nestjs/common';
import Twilio from 'twilio';

type resType = {
  first_name: string;
  last_name: string;
  date: string;
  seating_time: string;
  guest_count: number;
  category: { name: string };
  cancel_url: string;
};

@Injectable()
export class NotificationService {
  private readonly twilioClient: Twilio.Twilio;
  constructor() {
    const accountSid = process.env.TWILIO_SID;
    const accountToken = process.env.TWILIO_TOKEN;

    this.twilioClient = Twilio(accountSid, accountToken);
  }

  private buildReservationTemplate(data: resType) {
    const brandName = 'Our Restaurant';
    return (
      `Your reservation request at ${brandName} has been received successfully! 🍽️✨\n\n` +
      `Reservation Details:\n` +
      `👤 Name:${data.first_name} ${data.last_name}\n` +
      `📅 Date: ${data.date}\n` +
      `⏰ Time: ${data.seating_time}\n` +
      `👥 Guests: ${data.guest_count}\n` +
      `🏷️ Section: ${data.category.name}\n\n` +
      `Status: Confirmed ⏳\n\n` +
      `To cancel or modify your reservation, please use the following link:\n` +
      `${data?.cancel_url ?? 'Cancel-URL'}\n\n` +
      `Thank you for choosing ${brandName}! ❤️`
    );
  }

  async sendSMSNotification(to: string, message: string) {
    try {
      const from = process.env.TWILIO_PHONE_NUMBER;
      return await this.twilioClient.messages.create({
        body: message,
        from,
        to,
      });
    } catch (error: any) {
      console.log(`Failed to send SMS to ${to}`, error.stack);
    }
  }

  async sendWhatsappNotification(to: string, message: string) {
    try {
      const from = process.env.TWILIO_WHATSAPP_NUMBER;
      return await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`,
      });
    } catch (error: any) {}
  }

  async sendReservationConfirmation(
    to: string,
    reservationData: resType,
  ) {
    const message = this.buildReservationTemplate(reservationData);
    return await this.sendWhatsappNotification(to, message);
  }
}
