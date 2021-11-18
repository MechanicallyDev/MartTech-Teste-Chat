export default {
  async sendEmailVerification(email: string, verificationToken: string) {
    // This function simulates an email service to provide the verification token
    // on the email the user provided.
    // It should be replaced by a real email service.
    console.log(
      `Fake user verification sent to ${email}: 
      Link to verify user: http://localhost:3333/user/verify/${verificationToken}`
    )
  },
}