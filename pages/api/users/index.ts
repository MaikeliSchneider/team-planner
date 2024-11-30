import { NextApiRequest, NextApiResponse } from "next";

import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import {
  assembleUserObject,
  generateRefreshToken,
  generateToken,
  generateUserCreatePayload,
} from "@/utils/user_utils";
import Company from "@/models/Company";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find();

        res.status(200).json({ success: true, users });
      } catch (error: any) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { companyId, isAdmin } = req.body;

        const company = await Company.findById(companyId);

        if (!company) return res.status(400).json({ success: false });

        const user = await generateUserCreatePayload(
          req.body,
          company,
          isAdmin,
        );

        await User.create(user);

        const accessToken = generateToken(assembleUserObject(user));
        const refreshToken = generateRefreshToken(assembleUserObject(user));

        res.status(200).json({
          success: true,
          accessToken,
          refreshToken,
        });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}