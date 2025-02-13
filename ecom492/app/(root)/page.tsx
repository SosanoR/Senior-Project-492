import Image from "next/image";
import run from "@/db/MongoDB"
export default async function Home() {
  const db = await run();
  cosnt collection = db.collection('items')
  return <></>;
}
