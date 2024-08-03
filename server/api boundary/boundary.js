const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51PVRhkBQYdvRSbbU9Y9xlRheqP1XPfW6CizK8QNLhFe0aMzeUCDyH1BWo5MZQZC9PK8v6akTVcBlJ25rccSyX1FQ00Zfwqb9cb');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: '2i3aungkhantmoe20@gmail.com',
        pass: 'jxqk wwqm yeet psnb'
    }
});


//sendEmail function to call email API to send email
async function sendEmail(booking_req,bookingId){
           // Prepare the email content
    const mailOptions = {
        from: {
            name: 'HotelBooking',
            address: 'HotelBooking@mail.com'
        },
        to: booking_req.email,
        subject: 'Booking Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hi ${booking_req.firstName} ${booking_req.lastName},</p>
                <p>Your reservation request for ${booking_req.hotelName} has been confirmed. Please review the details of your booking.</h2>
                <p>Booking Reference No. HB-${bookingId} &middot; ${new Date().toLocaleDateString()}</p>
                <h3>Booking Details</h3>
                <ul>
                    <li>Hotel Name: ${booking_req.hotelName}</li>
                    <li>Room Type: ${booking_req.roomType}</li>
                    <li>Price: ${booking_req.price}</li>
                    <li>Start Date: ${booking_req.startDate}</li>
                    <li>End Date: ${booking_req.endDate}</li>
                    <li>Guests: ${booking_req.guestDetails}</li>
                    <li>Special Requests: ${booking_req.special_req}</li>
                </ul>
                <p>We look forward to hosting you!</p>
                <p>Best regards,<br>Ascenda Booking Team</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw error;
    }
    
}

//stripe function to callstripe API to get payment session object including client secret

async function getPaymentSession(amount=2000){

    const paymentIntent=await stripe.paymentIntents.create({
        currency:"sgd",
        amount:amount//put this first based on actual hotel price
    });
    return paymentIntent;

}

async function retrieve_last4digits(payment_method){
    const paymentMethod =await stripe.paymentMethods.retrieve(payment_method);
    const last4 = paymentMethod.card.last4;
    return last4;
    
}
module.exports ={sendEmail,getPaymentSession,retrieve_last4digits}