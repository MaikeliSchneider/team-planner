import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import Meet from "@/models/Meet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { companyId } = req.body;

        const meets = await Meet.find({ companyId });

        res.status(200).json({ success: true, data: meets });
      } catch (error: any) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { companyId } = req.body;

        const company = await Company.findById(companyId);

        if (!company) return res.status(400).json({ success: false });

        const meet = await Meet.create(req.body);

        res.status(200).json({
          success: true,
          data: meet,
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
