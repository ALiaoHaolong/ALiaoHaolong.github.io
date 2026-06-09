// 文章颜色 1, 2, 3, >=4
const postsColors = ["#9cd7ff", "#368cf9", "#0349b4", "#032563"];
// 提交颜色 1-3, 4-6, 7-9, >=10
const commitsColors = ["#82e596", "#26a148", "#117f32", "#024c1a"];

// 根据计数值获取文章方块颜色
export const getPostsColor = (count: number): string => {
  if (count == 1) return postsColors[0];
  if (count == 2) return postsColors[1];
  if (count == 3) return postsColors[2];
  return postsColors[3];
}

// 根据计数值获取提交方块颜色
export const getCommitsColor = (count: number): string => {
  if (count <= 3) return commitsColors[0];
  if (count <= 6) return commitsColors[1];
  if (count <= 9) return commitsColors[2];
  return commitsColors[3];
}