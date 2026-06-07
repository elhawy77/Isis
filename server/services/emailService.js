const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'ma9933151@gmail.com',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

class EmailService {
  async sendWelcomeEmail(user) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Isis AI Video Generator! 🎬',
      html: `
        <h1>Welcome to Isis, ${user.username}!</h1>
        <p>Your account has been created successfully.</p>
        <p><strong>FREE PLAN ACTIVATED:</strong> 150 credits/month</p>
        <p>Start creating amazing AI videos today!</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
      `
    });
  }

  async sendPaymentConfirmation(invoice) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: invoice.user.email,
      subject: `Payment Confirmed - Invoice ${invoice.invoiceNumber}`,
      html: `
        <h1>Payment Received!</h1>
        <p>Thank you for your subscription.</p>
        <p><strong>Invoice:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Amount:</strong> $${invoice.amount}</p>
        <p><strong>Plan:</strong> ${invoice.planName}</p>
        <p>Your subscription is now active.</p>
      `
    });
  }

  async sendVideoReady(video, user) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Your Video is Ready! 🎬 - ${video.title}`,
      html: `
        <h1>Video Generated Successfully!</h1>
        <p>Your video "${video.title}" is ready to download.</p>
        <p><strong>Resolution:</strong> ${video.settings.resolution}</p>
        <p><strong>Duration:</strong> ${video.settings.duration}s</p>
        <a href="${process.env.CLIENT_URL}/dashboard/videos/${video._id}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Video</a>
      `
    });
  }

  async sendCreditsLow(user, remaining) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Low Credits Alert - ${remaining} remaining`,
      html: `
        <h1>Credits Running Low!</h1>
        <p>You have only ${remaining} credits remaining.</p>
        <p>Upgrade your plan to keep generating videos.</p>
        <a href="${process.env.CLIENT_URL}/pricing" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Upgrade Plan</a>
      `
    });
  }

  async sendSupportTicketCreated(ticket) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ticket.email,
      subject: `Support Ticket Created - ${ticket.ticketId}`,
      html: `
        <h1>Support Ticket Received</h1>
        <p>Your support ticket has been created successfully.</p>
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Subject:</strong> ${ticket.subject}</p>
        <p>We will respond within 24-48 hours.</p>
      `
    });
  }
}

module.exports = new EmailService();
