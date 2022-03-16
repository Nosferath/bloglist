const {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
} = require('../utils/list_helper');

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];
const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

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
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithManyBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of an empty list to be an empty object', () => {
    const result = favoriteBlog([]);
    expect(result).toEqual({});
  });

  test('of a list with a single blog to be that blog, without unneeded information', () => {
    let oneBlog = { ...listWithOneBlog[0] };
    oneBlog = {
      title: oneBlog.title,
      author: oneBlog.author,
      likes: oneBlog.likes,
    };
    const result = favoriteBlog(listWithOneBlog);
    expect(result).toEqual(oneBlog);
  });

  test('of a list with many blogs to be the one with most likes', () => {
    const mostLikesBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    const result = favoriteBlog(listWithManyBlogs);
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
    const result = mostBlogs(listWithOneBlog);
    expect(result).toEqual(singleAuthor);
  });

  test('of a list with many posts be the author with most blogs', () => {
    const mostBlogsAuthor = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    const result = mostBlogs(listWithManyBlogs);
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
    const result = mostLikes(listWithOneBlog);
    expect(result).toEqual(singleAuthor);
  });

  test('of a list with many posts be the author with most likes', () => {
    const mostLikesAuthor = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    const result = mostLikes(listWithManyBlogs);
    expect(result).toEqual(mostLikesAuthor);
  });
});
