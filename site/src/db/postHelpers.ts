export const authorImage = (post: any) => {
  if (post.attributedGitHubUser) {
    return `https://github.com/${post.attributedGitHubUser}.png?size=32`;
  } else {
    return post.author?.image || `https://github.com/${post.id.split("/")[0]}.png?size=32`;
  }
};

export const authorName = (post: any) => {
  if (post.attributedGitHubUser) {
    return `@${post.attributedGitHubUser}`;
  } else {
    return post.author?.name || post.id.split("/")[0];
    ;
  }
};