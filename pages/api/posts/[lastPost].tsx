import prisma from "../../../lib/prisma";

export default async function handle(req: any, res: any) {
  const { lastPost } = req.query;

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "asc",
    },
    skip: Math.max(0, lastPost - 32),
    take: Math.min(32, parseInt(lastPost)),
  });
  for (const post of posts) {
    post.createdAt = JSON.parse(JSON.stringify(post.createdAt));
  }
  res.json(posts);
}
