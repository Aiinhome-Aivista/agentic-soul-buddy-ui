import { devUrl } from "../env/env";
import { devUrl1 } from "../env/env";

export const POST_url = {
      login: devUrl + "social-login",
      ask: devUrl + "ask",
      signup: devUrl + "signup"
};

export const POST_url1 = {
      signup: devUrl1 + "signup",
      login: devUrl1 + "login",
      subscription: devUrl1 + "subscribe",
};

export const get_url1 = {
      questions: devUrl1 + "fetch_questions"
};