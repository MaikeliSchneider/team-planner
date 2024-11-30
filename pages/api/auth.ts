import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import {
  assembleUserObject,
  generateRefreshToken,
  generateToken,
  verifyUserToken,
} from "@/utils/user_utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, body, method } = req;

  console.log("🚀 ~ query, body, method => ", query, body, method);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { email, password } = body;

        console.log("🚀 ~ email, password => ", email, password);
        const user = await User.findOne({ email });

        console.log("🚀 ~ user => ", user);
        if (!user) return res.status(400).json({ success: false });

        const isPasswordCorrect = bcrypt.compare(password, user.passwordHash);

        console.log("🚀 ~ isPasswordCorrect => ", isPasswordCorrect);

        if (!isPasswordCorrect) return res.status(400).json({ success: false });

        const accessToken = generateToken(assembleUserObject(user));
        const refreshToken = generateRefreshToken(assembleUserObject(user));

        res.status(200).json({
          accessToken,
          refreshToken,
        });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    case "PATCH":
      if (!query.refreshToken) return res.status(400).json({ success: false });
      try {
        const user = verifyUserToken(query.refreshToken as string);
        const accessToken = generateToken(user);

        res.json({ accessToken });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}
