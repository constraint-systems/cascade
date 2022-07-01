import prisma from "../../lib/prisma";

export default async function handle(req: any, res: any) {
  const postCount = await prisma.post.count();

  res.json(postCount);
}
