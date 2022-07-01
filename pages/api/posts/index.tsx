import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 32,
  });
  for (const post of posts) {
    post.createdAt = JSON.parse(JSON.stringify(post.createdAt));
  }
  console.log(posts);
  res.json(posts);
}
