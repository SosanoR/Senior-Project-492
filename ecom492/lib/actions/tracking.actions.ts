"use server";

import { user_data } from "@/_common/types";
import client from "../db";
import { ObjectId } from "mongodb";
import { USER_PRODUCT_TRACKING_SIZE } from "../constants";

export async function recordUserLastViewed(item_id: string, user_id: string) {
  try {
    const collection = client.db("testDB").collection<user_data>("User");
    const userData = await collection.findOne(new ObjectId(user_id));
    if (userData) {
      console.log("user was found");
      let lastViewedPages = userData?.last_viewed;

      if (!lastViewedPages) {
        console.log("created field");
        lastViewedPages = [item_id];
      } else if (!lastViewedPages.includes(item_id)) {
        console.log("pushed new item");
        lastViewedPages.push(item_id);

        if (lastViewedPages.length > USER_PRODUCT_TRACKING_SIZE) {
          console.log("shifted");
          lastViewedPages.shift();
        }
      } else if (lastViewedPages.includes(item_id)) {
        console.log("moved to front");
        lastViewedPages = lastViewedPages.filter((id) => id !== item_id);
        lastViewedPages.push(item_id);
      } else {
        return;
      }
      const filter = { _id: new ObjectId(user_id) };
      const update = {
        $set: {
          last_viewed: lastViewedPages,
        },
      };

      console.log("lastViewedPages: ", lastViewedPages);
      await collection.updateOne(filter, update);
    }
  } catch (error) {
    console.log(error);
  }
}
