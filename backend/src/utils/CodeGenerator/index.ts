import { UserModel } from "../../routes/v1/Users/model";

export default async function generateUniqueSixDigitCode(): Promise<string> {
  const min = 100000;
  const max = 999999;

  while (true) {
    const code = String(Math.floor(Math.random() * (max - min + 1)) + min);
    const existingUser = await UserModel.findOne({ code });
    if (!existingUser) {
      return code;
    }
  }
}
