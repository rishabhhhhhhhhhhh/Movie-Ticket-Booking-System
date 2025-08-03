import { Inngest } from "inngest";
import User from "../models/Users.js";
import Booking from "../models/Bookings.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

export const inngest = new Inngest({ id: "cinexpress" });

// Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

// Inngest function to delete user data from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)
    }
)

// Inngest function to update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to cancel booking and release seats of show after 10 minutes of booking created and payment not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: "app/checkpayment" },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            // If payment not made, release seats
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)

// Inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email' },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: 'movie', model: 'Movie' }
        }).populate('user');

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
            body: `
                    <div style="background:#111827;padding:20px;text-align:center;color:#fff">
                        <img src="https://cinexpress-three.vercel.app/main_logo.png" alt="CineXpress Logo" style="height:80px;margin-bottom:5px;" />
                        <p style="margin:5px 0;font-size:16px;">Your Movie Tickets are Confirmed!</p>
                    </div>


                    <div style="padding:30px;color:#333">
                        <h2 style="margin-top:0;color:#1f2937">Hi ${booking.user.name},</h2>
                        <p>Thank you for your payment! Your booking has been successfully confirmed. Here are your details:</p>

                        <div style="margin:20px 0;line-height:1.5">
                        <p><strong>🎞️ Movie:</strong> ${booking.show.movie.title}</p>
                        <p><strong>🕒 Show Time:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })} at ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</p>
                        <p><strong>💺 Seats:</strong></p>
                        <div style="background:#f3f4f6;padding:15px;border-radius:6px;font-weight:600;margin-top:10px">
                            ${booking.bookedSeats.join(", ")}
                        </div>
                        <p><strong>💰 Amount Paid:</strong> $ ${booking.amount}</p>
                        <p><strong>🎟️ Booking ID:</strong> ${bookingId}</p>
                        </div>
                        <div style="text-align:center;margin-top:30px">
                            <a href="https://cinexpress-three.vercel.app/my-bookings"
                            style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
                            View My Booking
                            </a>
                        </div>

                    <div style="text-align:center;padding:20px;font-size:12px;color:#9ca3af">
                        © 2025 CineXpress. All rights reserved.<br>
                        You received this email because you made a booking with us.
                    </div>
                    </div>
                    `
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];