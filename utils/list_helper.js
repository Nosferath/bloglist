const _ = require('lodash/collection');
const Blog = require('../models/blog');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reduceLikes = (sum, blog) => sum + blog.likes;
  const likes = blogs.reduce(reduceLikes, 0);

  return likes;
};

const reduceByMost = (collection, property) => (
  /* Returns the object in the collection that has highest value of property
   If multiple values are tied, the item appearing first is returned.
   I tried to find a function in Lodash that did something similar but
   I could not, and since I use this mechanic many times, I'd rather
   set it to its own function */
  collection.reduce(
    (curMost, item) => (item[property] > curMost[property]
      ? item
      : curMost),
    // The initial object has the property set to negative infinity
    Object.fromEntries([[property, Number.NEGATIVE_INFINITY]]),
  )
);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let favorite = reduceByMost(blogs, 'likes');
  // Remove unneeded information
  favorite = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };

  return favorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  // Blogs are returned as [{"author": "blogs"}, ...]
  let blogsByAuthor = _.countBy(blogs, 'author');
  // Convert to desired format {author: "author", blogs: "blogs"}
  blogsByAuthor = _.map(blogsByAuthor, (curBlogs, curAuthor) => ({
    author: curAuthor,
    blogs: curBlogs,
  }));
  // Obtain author with most blogs
  const mostBlogsAuthor = reduceByMost(blogsByAuthor, 'blogs');
  return mostBlogsAuthor;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  // Gather likes per author
  let likesPerAuthor = blogs.reduce((prevLikes, blog) => {
    const toReturn = { ...prevLikes };
    const curAuthor = blog.author;
    const curLikes = (prevLikes[curAuthor] || 0) + blog.likes;
    toReturn[curAuthor] = curLikes;
    return toReturn;
  }, {});
  // Convert to desired format {author: "author", likes: "likes"}
  likesPerAuthor = _.map(likesPerAuthor, (curLikes, curAuthor) => ({
    author: curAuthor,
    likes: curLikes,
  }));
  // Obtain author with most blogs
  const mostLikesAuthor = reduceByMost(likesPerAuthor, 'likes');
  return mostLikesAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
