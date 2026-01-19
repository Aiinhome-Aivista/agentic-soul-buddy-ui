// import { devUrl } from "../env/env";
import { devUrl1} from "../env/env";

// export const POST_url = {
//       login: devUrl + "social-login",
//       ask: devUrl + "ask",
//       signup: devUrl + "signup"   
// };

export const POST_url1 = {
  signup: devUrl1 + "signup",
  login: devUrl1 + "login",
  subscription: devUrl1 + "subscribe",
  submit_response: devUrl1 + "submit_response",
  wellbeing: devUrl1 + "wellbeing-profile",
  ask: devUrl1 + "voice-ask",
  user_details: devUrl1 + "user_details",
  contact_us: devUrl1 + "contact",
  login_with_email: devUrl1 + "login_email",
  password_reset_request: devUrl1 + "forgot_password_request",
  password_reset: devUrl1 + "forgot_password_reset",
  start_subscription: devUrl1 + "start_subscription",
  send_otp: devUrl1 + "send_otp",
  verify_otp: devUrl1 + "verify_otp",
  cupon_validate: devUrl1 + "validate_coupon"
};

export const get_url1 = {
      questions: devUrl1 + "fetch_questions",
      terms: devUrl1 + "terms-and-conditions",
      disclaimer: devUrl1 + "disclaimer",
      faq: devUrl1 + "faqs",
      subscription_status: devUrl1 + "subscription_status",
  subscription_plan: devUrl1 + "subscription_plan",
  capcha: devUrl1 + "generate_captcha"
};