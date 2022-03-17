const {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
} = require('../utils/list_helper');
const helper = require('./test_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(helper.listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(helper.listWithManyBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of an empty list to be an empty object', () => {
    const result = favoriteBlog([]);
    expect(result).toEqual({});
  });

  test('of a list with a single blog to be that blog, without unneeded information', () => {
    let oneBlog = { ...helper.listWithOneBlog[0] };
    oneBlog = {
      title: oneBlog.title,
      author: oneBlog.author,
      likes: oneBlog.likes,
    };
    const result = favoriteBlog(helper.listWithOneBlog);
    expect(result).toEqual(oneBlog);
  });

  test('of a list with many blogs to be the one with most likes', () => {
    const mostLikesBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    const result = favoriteBlog(helper.listWithManyBlogs);
    expect(result).toEqual(mostLikesBlog);
  });
});

describe('most blogs', () => {
  test('of an empty list should be an empty object', () => {
    const result = mostBlogs([]);
    expect(result).toEqual({});
  });

  test('of a list with a single blog should be the author of that blog', () => {
    const singleAuthor = {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    };
    const result = mostBlogs(helper.listWithOneBlog);
    expect(result).toEqual(singleAuthor);
  });

  test('of a list with many posts be the author with most blogs', () => {
    const mostBlogsAuthor = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    const result = mostBlogs(helper.listWithManyBlogs);
    expect(result).toEqual(mostBlogsAuthor);
  });
});

describe('most likes', () => {
  test('of an empty list should be an empty object', () => {
    const result = mostLikes([]);
    expect(result).toEqual({});
  });

  test('of a list with a single blog should be the author of that blog', () => {
    const singleAuthor = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    };
    const result = mostLikes(helper.listWithOneBlog);
    expect(result).toEqual(singleAuthor);
  });

  test('of a list with many posts be the author with most likes', () => {
    const mostLikesAuthor = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    const result = mostLikes(helper.listWithManyBlogs);
    expect(result).toEqual(mostLikesAuthor);
  });
});
