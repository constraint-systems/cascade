import prisma from "../../../lib/prisma";

// POST /api/post
export default async function handle(req, res) {
  const { content } = req.body;

  const result = await prisma.post.create({
    data: {
      content,
    },
  });
  res.json(result);
}
